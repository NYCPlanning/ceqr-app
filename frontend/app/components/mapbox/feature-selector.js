import Component from '@ember/component';

/**
 * This component binds a Mapbox::CurrentMouseEvent component to mapbox 'click' event, and passes the
 * yielded event with mouse location to a Mapbox::IntersectingFeatures component, configured to
 * query layer with id = layerId for features intersecting with the click event.
 * Resulting intersecting features array is yielded out in the mapbox-feature-selector template
 */
export default class MapboxFeatureSelectorComponent extends Component {
  tagName = '';
  /**
   * MapboxGL Instance
   */
  map = {};

  /**
   * Layer ID to query for features
   */
  layerId = '';
}
