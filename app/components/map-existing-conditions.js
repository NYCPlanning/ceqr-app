import Component from '@ember/component';
import { inject as service } from '@ember/service';
// import bbox from 'npm:@turf/bbox';

/*
TODO:
- Center on extent of geometries
- Popups on map for: bbl, subdistrict, schools
*/

export default Component.extend({  
  mapdata: service(),
  
  didReceiveAttrs() {
    this._super(...arguments);
    this.get('mapdata').setProject(this.get('project'));
  }, 

  // UI attributes
  showZones: false,
  schoolZone: 'es',
  hsAnalysis: false,
  
  // Map attributes
  map: null,
  // mapZoomTo(geojson) {
  //   let extent = bbox(geojson);
  //   console.log(extent);
  //   this.get('map').fitBounds(bbox);
  // },

  actions: {
    handleMapLoad(map) {
      this.set('map', map);
      window.map = map;
    },
  }
});
