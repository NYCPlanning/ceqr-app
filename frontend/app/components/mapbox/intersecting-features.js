import Component from '@ember/component';

export default class MapboxIntersectingFeatures extends Component {
  // required
  // option
  // mapbox-gl instance
  map = {};

  // id of layer to query
  options = {};

  // a mapbox-gl "point-like" object
  point = {}

  /**
   * Callback called upon successfully acquiring features at @point
   * @function
   * @param {Array.<object>} features - array of features intersecting @point
   */
  handleIntersectingFeatures = () => {};

  // features at given @point and in layers of @options.layers
  _intersectingFeatures = null;

  didReceiveAttrs() {
    const { map, point, options } = this;
    const { instance } = map;
    const queriedFeatures = instance.queryRenderedFeatures(point, { ...options });
    this.set('_intersectingFeatures', queriedFeatures);
    if (this.handleIntersectingFeatures) {
      this.handleIntersectingFeatures(queriedFeatures);
    }
  }
}
