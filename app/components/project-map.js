import Component from '@ember/component';
import { inject as service } from '@ember/service';
import mapboxgl from 'mapbox-gl';

export default Component.extend({  
  tablehover: service(),
  mapdata: service(),
  mapservice: service(),
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
  zoneName: null,

  dotHover({source, id}) {
    if (this.get('map')) this.get('map').setFilter(`${source}-hover`, ["==", ["get", "cartodb_id"], id])
  },

  dotUnhover({source}) {
    if (this.get('map')) this.get('map').setFilter(`${source}-hover`, ["==", ["get", "cartodb_id"], 0])
  },

  displayPopup(e, source) {
    this.get('map').getCanvas().style.cursor = 'default';
    this.dotHover({source, id: e.features[0].properties.cartodb_id})

    let html = `<table class="ui simple table inverted">
      <thead>
        <tr><th>Org ID</th><th>Bldg ID</th><th>Org Name</th><th>Level</th></tr>
      </thead>
    `;
    e.features.forEach((f) => {
      this.get('tablehover').trigger('hover', {source, id: f.properties.cartodb_id});
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

  removePopup(source) {
    this.get('tablehover').trigger('unhover', {source});
    this.get('map').getCanvas().style.cursor = '';
    this.get('schoolPopup').remove();
  },

  actions: {
    zoneHover(e) {
      if (this.get('showZones') && `${this.get('schoolZone')}-zones-hover` === e.features[0].layer.id) {
        if (e.features[0].properties.remarks === "null") {
          this.set('zoneName', e.features[0].properties.dbn)
        } else {
          this.set('zoneName', e.features[0].properties.remarks)
        }
      }
    },

    zoneUnhover() {
      this.set('zoneName', null);
    },
    
    lcgmsHover(e) {
      this.displayPopup(e, 'lcgms');
    },

    lcgmsUnhover() {
      this.removePopup('lcgms');
    },

    schoolHover(e) {      
      this.displayPopup(e, 'bluebook');
    },

    schoolUnhover() {
      this.removePopup('bluebook');
    },
    
    handleMapLoad(map) {
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-right');
      
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'top-right');

      this.set('mapservice.map', map);
      this.get('mapservice').fitToSubdistricts();

      this.set('map', map);
    },
  }
});
