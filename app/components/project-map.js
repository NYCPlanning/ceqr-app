import Component from '@ember/component';
import { inject as service } from '@ember/service';
import bbox from 'npm:@turf/bbox';
import mapboxgl from 'mapbox-gl';

/*
TODO:
- Popups on map for: bbl, subdistrict
*/

export default Component.extend({  
  tablehover: service(),
  mapdata: service(),
  map: null,
  
  didReceiveAttrs() {
    this._super(...arguments);
    this.get('mapdata').setProject(this.get('project'));

    this.get('tablehover').on('hover', this, 'dotHover');
    this.get('tablehover').on('unhover', this, 'dotUnhover');

    this.set('schoolPopup', new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    }))
  },

  willDestroyElement() {
    this.get('tablehover').off('hover', this, 'dotHover');
    this.get('tablehover').off('unhover', this, 'dotUnhover');
  },

  // UI attributes
  showZones: false,
  schoolZone: 'es',
  hsAnalysis: false,

  dotHover({source, id}) {
    this.get('map').setFilter(`${source}-hover`, ["==", ["get", "cartodb_id"], id]);
  },

  dotUnhover({source}) {
    this.get('map').setFilter(`${source}-hover`, ["==", ["get", "cartodb_id"], 0])
  },

  actions: {
    schoolHover(e) {
      this.get('map').getCanvas().style.cursor = 'default';
      this.dotHover({source: 'bluebook', id: e.features[0].properties.cartodb_id})

      let html = `<table class="ui simple table inverted">
        <thead>
          <tr><th>Org ID</th><th>Bldg ID</th><th>Org Name</th><th>Level</th></tr>
        </thead>
      `;
      e.features.forEach((f) => {
        this.get('tablehover').trigger('hover', {source: 'bluebook', id: f.properties.cartodb_id});
        let row = `<tr>
          <td>${f.properties.org_id}</td>
          <td>${f.properties.bldg_id}</td>
          <td>${f.properties.org_name}</td>
          <td>${f.properties.level}</td>
        </tr>`;
        html = html + row;
      });
      html = html + '</table>';

      this.get('schoolPopup')
        .setLngLat(e.features[0].geometry.coordinates.slice())
        .setHTML(html)
        .addTo(this.get('map'));
    },

    schoolUnhover() {
      this.get('tablehover').trigger('unhover', {source: 'bluebook'});
      this.get('map').getCanvas().style.cursor = '';
      this.get('schoolPopup').remove();
    },
    
    handleMapLoad(map) {
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');

      this.get('mapdata.subdistrictGeojson').then(
        (g) => map.fitBounds(bbox.default(g))
      );

      this.set('map', map);
    },
  }
});
