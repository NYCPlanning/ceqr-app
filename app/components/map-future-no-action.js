import Component from '@ember/component';
import { inject as service } from '@ember/service';
import bbox from 'npm:@turf/bbox';

export default Component.extend({
  mapdata: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    this.get('mapdata').setProject(this.get('project'));
  }, 

  actions: {
    handleMapLoad(map) {
      this.get('mapdata.subdistrictGeojson').then(
        (g) => map.fitBounds(bbox.default(g))
      );
    },
  }
});
