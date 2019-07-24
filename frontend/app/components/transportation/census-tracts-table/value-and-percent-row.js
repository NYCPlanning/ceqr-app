import Component from '@ember/component';

/**
 * ValueAndPercentRowComponent renders a TableRow in the Census Tracts table, populated with the modal
 * split estimate value and also percent for the given variable.
 * (see
 *  - helpers/get-split-value
 *  - helpers/get-aggregate-value
 *  - helpers/get-split-percent
 *  - helpers/get-aggregate-percent
 * )
 */
export default class TransportationCensusTractsTableValueAndPercentRowComponent extends Component {
  tagName = 'tr';
  /**
   * Definition title to display for row
   */
  title = '';
  /**
   * Variable name to display estimate value for
   */
  variable = '';
  /**
   * Array of all modal-split data
   */
  allModalSplitData = [];
  /**
   * If true, percent values are blanked out. 
   */
  noPercent = false;
}
