import Component from '@ember/component';
import { inject as service } from '@ember/service';
// import bbox from 'npm:@turf/bbox';

export default Component.extend({  
  analysis: service(),
  
  // UI attributes
  zoneDisplay: 'es',
  hsAnalysis: false,
  
  // Map attributes
  map: null,
  mapZoomTo(geojson) {
    // let extent = bbox(geojson);
    // console.log(extent);
    // this.get('map').fitBounds(bbox);
  },

  actions: {
    handleMapLoad(map) {
      this.set('map', map);
      window.map = map;
    },
  }
});
