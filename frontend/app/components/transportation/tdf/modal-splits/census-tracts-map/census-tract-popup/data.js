import Component from '@ember/component';

/**
 * The Data component is responsible for asyncrhonously fetching census-tract records for a given
 * geoid. The data yielded by this component is a RecordArray, because the resources are retrieved
 * with the query() method with a filter for geoid. This component leverages ThrottleProperty component
 * to debounce network requests, and avoid unnecessarily high rate of network requests while a user
 * moves quickly across the map.
 */
export default class TransportationCensusTractsMapCensusTractPopupDataComponent extends Component {
  tagName = '';
  /**
   * The name of the data resource to asynchronously request
   */
  resource = 'transportation-census-estimate';
}
