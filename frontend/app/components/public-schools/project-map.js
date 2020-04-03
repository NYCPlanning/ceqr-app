import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import mapboxgl from 'mapbox-gl';
import mapColors from 'labs-ceqr/utils/mapColors';

import ENV from 'labs-ceqr/config/environment';

export default Component.extend({
  tablehover: service(),
  mapservice: service(),
  router: service(),
  map: null,

  didReceiveAttrs() {
    this._super(...arguments);

    this.tablehover.on('hover', this, 'dotHover');
    this.tablehover.on('unhover', this, 'dotUnhover');

    this.set('schoolPopup', new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    }));

    this.set('schoolZonesGeojson', {
      type: 'FeatureCollection',
      features: [],
    });
  },

  willDestroyElement() {
    this.get('tablehover').off('hover', this, 'dotHover');
    this.get('tablehover').off('unhover', this, 'dotUnhover');
  },

  // UI attributes
  showZones: false,
  schoolZone: 'ps',
  hsAnalysis: false,
  zoneName: null,
  mapColors,

  dotHover({ source, id }) {
    if (this.get('map')) this.get('map').setFilter(`${source}-hover`, ['==', ['get', 'id'], id]);
  },

  dotUnhover({ source }) {
    if (this.get('map')) this.get('map').setFilter(`${source}-hover`, ['==', ['get', 'id'], 0]);
  },

  toggleZones: observer('showZones', 'schoolZone', function() { // eslint-disable-line
    if (this.showZones != false) {
      this.fetchSchoolZones.perform();
    } else {
      this.set('schoolZonesGeojson', {
        type: 'FeatureCollection',
        features: [],
      });
    }
  }),

  fetchSchoolZones: task(function* () {
    const version = this.analysis.get(`dataPackage.schemas.doe_school_zones_${this.schoolZone}.table`);

    const response = yield fetch(`${ENV.host}/ceqr_data/v1/doe_school_zones/${this.schoolZone}/${version}/geojson?borocode=${this.project.boroCode}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const geojson = yield response.json();

    this.set('schoolZonesGeojson', geojson);
  }).drop(),

  actions: {
    zoneHover(e) {
      if (this.get('showZones') && e.features[0].layer.id === 'zones-hover') {
        if (e.features[0].properties.remarks === 'null') {
          this.set('zoneName', e.features[0].properties.dbn);
        } else {
          this.set('zoneName', e.features[0].properties.remarks);
        }
      }
    },

    zoneUnhover() {
      this.set('zoneName', null);
    },

    displayPopup(e) {
      this.get('map').getCanvas().style.cursor = 'default';
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['buildings', 'scaprojects'] });

      if (features.length) {
        const schools = features.map((b) => ({
          ...b.properties,
          layer_id: b.layer.id,
        }));

        let html = `<table class="ui simple table inverted">
          <thead>
            <tr><th>Org Name</th><th>Org ID</th><th>Bldg ID</th><th>Level</th></tr>
          </thead>
        `;
        schools.forEach((school) => {
          this.dotHover({ source: school.layer_id, id: school.id });
          this.get('tablehover').trigger('hover', { source: school.layer_id, id: school.id });

          let org_name;
          if (school.source === 'lcgms') {
            org_name = `${school.name}<br>(newly built)`;
          } else if (school.source === 'scaprojects') {
            org_name = `${school.name}<br>(under construction)`;
          } else {
            org_name = school.name;
          }

          const row = `<tr>
            <td>${org_name}</td>
            <td>${school.org_id || ''}</td>
            <td>${school.bldg_id || ''}</td>
            <td>${school.level}</td>
          </tr>`;
          html += row;
        });
        html += '</table>';

        this.get('schoolPopup')
          .setLngLat(features[0].geometry.coordinates.slice())
          .setHTML(html)
          .addTo(this.get('map'));
      } else {
        this.get('schoolPopup').remove();

        this.get('tablehover').trigger('unhover', { source: 'buildings' });
        this.get('tablehover').trigger('unhover', { source: 'scaprojects' });

        this.get('map').getCanvas().style.cursor = '';
      }
    },

    handleMapLoad(map) {
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');

      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'top-right');

      this.set('mapservice.map', map);
      this.get('mapservice').fitToSubdistricts(this.subdistrictsGeojson);

      this.set('map', map);
    },
  },
});
