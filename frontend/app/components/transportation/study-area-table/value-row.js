import Component from '@ember/component';

/**
 * ValueRowComponent renders a TableRow in the study area table, populated with the modal
 * split estimate value for the given variable.
 * (see helpers/get-split-value and helpers/get-aggregate-value)
 */
export default class TransportationStudyAreaTableValueRowComponent extends Component {
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
}
