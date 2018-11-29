import Service from '@ember/service';
import { inject as service } from '@ember/service';
import bbox from 'npm:@turf/bbox';

export default Service.extend({
  mapdata: service(),
  
  init() {
    this._super(...arguments);
    this.set('map', {});
  },

  fitToSubdistricts() {
    this.get('mapdata.subdistrictGeojson').then(
      (g) => this.get('map').fitBounds(bbox.default(g))
    );
  }
});
