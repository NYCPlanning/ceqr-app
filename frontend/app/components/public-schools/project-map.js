import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer, action, set } from '@ember/object';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import mapboxgl from 'mapbox-gl';
import mapColors from 'labs-ceqr/utils/mapColors';
import { tracked } from "@glimmer/tracking";

import ENV from 'labs-ceqr/config/environment';

export default class PublicSchoolsProjectMapComponent extends Component {
  tagName = '';
  @service() tablehover;
  @service() mapservice;
  @service() router;
  map = null;

  didReceiveAttrs() {
    super.didReceiveAttrs();
    super.didReceiveAttrs(...arguments);

    this.tablehover.on('hover', this, 'dotHover');
    this.tablehover.on('unhover', this, 'dotUnhover');

    set(
      this,
      'schoolPopup',
      new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })
    );

    set(this, 'schoolZonesGeojson', {
      type: 'FeatureCollection',
      features: [],
    });
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    super.willDestroyElement(...arguments);
    this.tablehover.off('hover', this, 'dotHover');
    this.tablehover.off('unhover', this, 'dotUnhover');
  }

  // UI attributes
  @tracked showZones = false;
  @tracked schoolZone = 'ps';
  hsAnalysis = false;
  zoneName = null;
  mapColors = mapColors;

  dotHover({ source, id }) {
    if (this.map)
      this.map.setFilter(`${source}-hover`, ['==', ['get', 'id'], id]);
  }

  dotUnhover({ source }) {
    if (this.map)
      this.map.setFilter(`${source}-hover`, ['==', ['get', 'id'], 0]);
  }

  toggleZones= observer('showZones', 'schoolZone', function() { // eslint-disable-line
    if (this.showZones !== false) {
      this.fetchSchoolZones.perform();
    } else {
      set(this, 'schoolZonesGeojson', {
        type: 'FeatureCollection',
        features: [],
      });
    }
  });

  @(task(function* () {
    const version = this.analysis.get(
      `dataPackage.schemas.doe_school_zones_${this.schoolZone}.table`
    );

    const response = yield fetch(
      `${ENV.host}/ceqr_data/v1/doe_school_zones/${this.schoolZone}/${version}/geojson?borocode=${this.project.boroCode}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const geojson = yield response.json();

    set(this, 'schoolZonesGeojson', geojson);
  }).drop())
  fetchSchoolZones;

  @action
  zoneHover(e) {
    if (this.showZones && e.features[0].layer.id === 'zones-hover') {
      if (e.features[0].properties.remarks === 'null') {
        set(this, 'zoneName', e.features[0].properties.dbn);
      } else {
        set(this, 'zoneName', e.features[0].properties.remarks);
      }
    }
  }

  @action
  zoneUnhover() {
    set(this, 'zoneName', null);
  }

  @action
  displayPopup(e) {
    this.map.getCanvas().style.cursor = 'default';
    const features = this.map.queryRenderedFeatures(e.point, {
      layers: ['buildings', 'scaprojects'],
    });

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
        this.tablehover.trigger('hover', {
          source: school.layer_id,
          id: school.id,
        });

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

      this.schoolPopup
        .setLngLat(features[0].geometry.coordinates.slice())
        .setHTML(html)
        .addTo(this.map);
    } else {
      this.schoolPopup.remove();

      this.tablehover.trigger('unhover', { source: 'buildings' });
      this.tablehover.trigger('unhover', { source: 'scaprojects' });

      this.map.getCanvas().style.cursor = '';
    }
  }

  @action
  handleMapLoad(map) {
    map.addControl(
      new mapboxgl.ScaleControl({ unit: 'imperial' }),
      'bottom-right'
    );

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-right');

    set(this, 'mapservice.map', map);
    this.mapservice.fitToSubdistricts(this.subdistrictsGeojson);

    set(this, 'map', map);
  }

  @action
  setShowZones(shouldShow) {
    console.info("shouldShow", shouldShow);
    this.showZones = shouldShow;
  }

  @action
  setSchoolZone(zone) {
    console.info("schoolZone", zone);
    this.schoolZone = zone;
  }
}
