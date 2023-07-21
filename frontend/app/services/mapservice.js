import Service from '@ember/service';
import bbox from '@turf/bbox';
import { set } from '@ember/object';

export default class MapService extends Service {
  constructor(...args) {
    super(...args);
    set(this, 'map', {});
  }

  fitToSubdistricts(geojson) {
    this.map.fitBounds(bbox(geojson));
  }
}
