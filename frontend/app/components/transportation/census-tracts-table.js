import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';
import { VARIABLE_MODE_LOOKUP, COMMUTER_VARIABLES } from '../../utils/modalSplit';

/**
 * CensusTractsTable component renders modal-split data for a project's study selection census tracts
 * in a table. The table updates as census tracts are added to/removed from the study selection.
 */
export default class TransportationCensusTractsTableComponent extends Component {

  /**
  * array of census tract IDs, each displayed as a column
 * @param {string[]} 
 */
  selectedCensusTractIds = []

  /**
  * array of census tract modal splits, usually returned using readonlyStore.findByIds().
  * Each modal split is displayed as a row.
 * @param {modalSplit[]} 
 */
  selectedCensusTractData = []

}
