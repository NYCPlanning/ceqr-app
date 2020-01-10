import Component from '@ember/component';

export const MODAL_SPLIT_POPUP_DISPLAY_VARIABLES = [
  'trans_auto_total',
  'trans_taxi',
  'trans_public_subway',
  'trans_public_bus',
  'trans_walk_other',
  'trans_commuter_total',
];

/**
 * ModalSplitFormatter component is responsible for correctly ingesting census estimate records
 * and formatting the data for display.
 */
export default class TransportationCensusTractsMapCensusTractPopupModalSplitFormatterComponent extends Component {
  /**
   * ACS modal-split, composed from multiple 'acs-estimate' rows
   * (See utils/modalSplit)
   */
  acsData = {};

  /**
   * CTPP modal-split, composed from multiple 'ctpp-estimate' rows
   * (See utils/modalSplit)
   */
  ctppData = {};

  /**
   * Modal split variables to display in the popup
   */
  displayVariables = MODAL_SPLIT_POPUP_DISPLAY_VARIABLES;
}
