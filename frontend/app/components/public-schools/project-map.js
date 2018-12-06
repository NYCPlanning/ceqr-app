import Component from '@ember/component';
import { inject as service } from '@ember/service';
// import { observer } from '@ember/object';
// import { alias } from '@ember/object/computed';
import mapboxgl from 'mapbox-gl';
import mapColors from '../../utils/mapColors';

export default Component.extend({  
  tablehover: service(),
  mapdata: service(),
  mapservice: service(),
  router: service(),
  map: null,
  
  didReceiveAttrs() {
    this._super(...arguments);
    
    this.mapdata.set('project', this.project);
    this.mapdata.set('analysis', this.analysis);

    this.tablehover.on('hover', this, 'dotHover');
    this.tablehover.on('unhover', this, 'dotUnhover');

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
  mapColors,

  dotHover({source, id}) {
    if (this.get('map')) this.get('map').setFilter(`${source}-hover`, ["==", ["get", "cartodb_id"], id])
  },

  dotUnhover({source}) {
    if (this.get('map')) this.get('map').setFilter(`${source}-hover`, ["==", ["get", "cartodb_id"], 0])
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

    displayPopup(e) {
      this.get('map').getCanvas().style.cursor = 'default';
      let features = this.map.queryRenderedFeatures(e.point, { layers: ['bluebook','lcgms','scaprojects'] })
      
      if (features.length) {
        const schools = features.map((b) => ({ 
          type: b.layer.id,
          ...b.properties
        }))

        let html = `<table class="ui simple table inverted">
          <thead>
            <tr><th>Org ID</th><th>Bldg ID</th><th>Org Name</th><th>Level</th></tr>
          </thead>
        `;
        schools.forEach((s) => {
          this.dotHover({source: s.type, id: s.cartodb_id})
          this.get('tablehover').trigger('hover', {source: s.type, id: s.cartodb_id});
          
          let org_name;
          if (s.type === 'lcgms') {
            org_name = `${s.name}<br>(newly built)`
          } else if (s.type === 'scaprojects') {
            org_name = `${s.name}<br>(under construction)`
          } else {
            org_name = s.name
          }
          
          let row = `<tr>
            <td>${org_name}</td>  
            <td>${s.org_id || ""}</td>
            <td>${s.bldg_id || ""}</td>
            <td>${s.org_level}</td>
          </tr>`;
          html = html + row;
        });
        html = html + '</table>';
    
        this.get('schoolPopup')
          .setLngLat(features[0].geometry.coordinates.slice())
          .setHTML(html)
          .addTo(this.get('map'));
      } else {
        this.get('schoolPopup').remove();

        this.get('tablehover').trigger('unhover', {source: 'bluebook'});
        this.get('tablehover').trigger('unhover', {source: 'lcgms'});
        this.get('tablehover').trigger('unhover', {source: 'scaprojects'});

        this.get('map').getCanvas().style.cursor = '';
      }
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
