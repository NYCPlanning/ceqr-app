import Service from '@ember/service';
import bbox from '@turf/bbox';

export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('map', {});
  },

  fitToSubdistricts(geojson) {
    this.map.fitBounds(bbox(geojson));
  },
});
