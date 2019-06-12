import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export const MODAL_SPLIT_POPUP_DISPLAY_VARIABLES = [
  'population',
  'trans_total',
  'trans_auto_total',
  'trans_public_total'
]
/**
 * ModalSplitFormatter component is responsible for correctly ingesting census-tract records
 * and formatting the data for display. Due to the data model, multiple records are required
 * to get the full data for a single census tract, and must be rendered correctly depending on
 * which variable a single record is for. For variable = "population", the data is presented separately.
 * All other variables are displayed in a table (see template for structure)
 */
export default class TransportationStudyAreaMapCensusTractPopupModalSplitFormatterComponent extends Component {
  /**
   * Modal-split, composed from multiple 'transportation-census-estimate' rows
   * (See utils/modal-split)
   */
  data = {};

  /**
   * The set of modal split variables that should be displayed in the popup
   */
  @computed('data')
  get modalSplitData() {
    const { data } = this;
    return MODAL_SPLIT_POPUP_DISPLAY_VARIABLES.map(variable => data[variable]);
  }
}
