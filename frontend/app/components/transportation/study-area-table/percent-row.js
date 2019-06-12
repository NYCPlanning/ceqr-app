import Component from '@ember/component';

/**
 * PercentRowComponent renders a TableRow in the study area table, populated with the modal
 * split percent for the given variables.
 * (see helpers/get-split-percent and helpers/get-aggregate-percent)
 */
export default class TransportationStudyAreaTablePercentRowComponent extends Component {
  tagName = 'tr';
  /**
   * Definition title to display for row
   */
  title = '';
  /**
   * Array of variables to aggregate for modal split percent
   */
  variables = [];
  /**
   * Array of all modal-split data
   */
  allModalSplitData = [];
}
