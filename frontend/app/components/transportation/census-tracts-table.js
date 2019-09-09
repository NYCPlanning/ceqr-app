import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { getAggregateValue } from '../../helpers/get-aggregate-value';

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

  // TODO: Figure out how to work around async selectedCensusTractData property.
  // Then, move this into existing-conditions controller.
  @computed('selectedCensusTractData.[]')
  get vehicleOccupancyAvg() {
    if(this.selectedCensusTractData){
      return getAggregateValue([this.selectedCensusTractData, ["vehicle_occupancy"]]) / this.selectedCensusTractData.length;
    }
    return null;
  }

  /**
  * array of census tract modal splits, usually returned using readonlyStore.findByIds().
  * Each modal split is displayed as a row.
  */
  @computed('acsModalSplits', 'ctppModalSplits', 'isRJTW')
  get selectedCensusTractData() {
    if (this.isRJTW) {
      return this.ctppModalSplits;
    } else {
      return this.acsModalSplits;
    }
  }
}
