import Component from '@ember/component';
import { set } from '@ember/object';

export default class MapboxIntersectingFeatures extends Component {
  tagName = '';
  // required
  // option
  // mapbox-gl instance
  map = {};

  // id of layer to query
  options = {};

  // a mapbox-gl "point-like" object
  point = {};

  /**
   * Callback called upon successfully acquiring features at @point
   * @function
   * @param {Array.<object>} features - array of features intersecting @point
   */
  handleIntersectingFeatures = () => {};

  // features at given @point and in layers of @options.layers
  _intersectingFeatures = null;

  didReceiveAttrs() {
    super.didReceiveAttrs();
    const { map, point, options } = this;
    const { instance } = map;
    const queriedFeatures = instance.queryRenderedFeatures(point, {
      ...options,
    });
    set(this, '_intersectingFeatures', queriedFeatures);
    if (this.handleIntersectingFeatures) {
      this.handleIntersectingFeatures(queriedFeatures);
    }
  }
}
