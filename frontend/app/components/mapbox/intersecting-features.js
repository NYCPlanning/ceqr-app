import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class MapboxIntersectingFeatures extends Component {
  // required
  // option
  // mapbox-gl instance
  map = {};

  // id of layer to query
  options = {};

  // a mapbox-gl "point-like" object
  point = {}

  // grabs the intersecting features from mapbox-gl
  @computed('point', 'options')
  get intersectingFeatures() {
    const { map, point, options } = this;
    const { instance } = map;

    return instance.queryRenderedFeatures(point, { ...options });
  }
}
