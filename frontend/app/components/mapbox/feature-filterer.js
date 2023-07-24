import Component from '@ember/component';

/**
 * Component to filter a given layer to a set of features specified by a list of their Ids.
 */
export default class MapboxFeatureFiltererComponent extends Component {
  tagName = '';
  /** @param {Mapbox Map} Mapbox map */
  map = {};

  /** @param {string} id of the carto layer instantiated using `Mapbox::CartoLayer` */
  layerId = null;

  /** @param {string} key identifier for features */
  filterById = 'id';

  /** @param {string[]} array of feature id values. map will be restricted to this array of features */
  featureIds = [];

  // Compose  a MapboxGL filter like: ['in', 'id', '1', '2', '3'] using filterById and featureIds
  getFilter() {
    return this.featureIds.reduce(
      (filterExp, featureId) => {
        if (featureId) {
          filterExp.push(featureId);
        }
        return filterExp;
      },
      ['in', this.filterById]
    );
  }

  didReceiveAttrs() {
    super.didReceiveAttrs();
    const { instance } = this.map;
    if (this.featureIds && this.featureIds.length) {
      // filter to just features w id in featureIds
      instance.setFilter(this.layerId, this.getFilter());
    } else {
      // When not hovering anything, use falsey expression to filter out all features
      instance.setFilter(this.layerId, ['==', 'true', 'false']);
    }
  }
}
