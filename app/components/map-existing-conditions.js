import Component from '@ember/component';
import { inject as service } from '@ember/service';
import bbox from 'npm:@turf/bbox';

/*
TODO:
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
  // map: null,

  actions: {
    handleMapLoad(map) {
      this.get('mapdata.subdistrictGeojson').then(
        (g) => map.fitBounds(bbox.default(g))
      );
    },
  }
});
