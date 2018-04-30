import Component from '@ember/component';
import carto from 'carto-promises-utility/utils/carto';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { task, waitForProperty } from 'ember-concurrency';
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
