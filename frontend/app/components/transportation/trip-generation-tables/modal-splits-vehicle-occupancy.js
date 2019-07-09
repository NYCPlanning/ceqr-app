import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { action } from '@ember-decorators/object';
import { getAggregateValue } from '../../../helpers/get-aggregate-value';

export default class TransportationTripGenerationTablesModalSplitsVehicleOccupancyComponent extends Component {

  // The project's transportation analysis object.
  // Must be passed from parent component.
  analysis = {}

  @action
  saveAnalysis(){
    this.analysis.save();
  }

  @computed('selectedCensusTractData')
  get vehicleOccupancy() {
    if(this.selectedCensusTractData){
      return getAggregateValue([this.selectedCensusTractData, ["vehicle_occupancy"]]) / this.selectedCensusTractData.length;
    }
    return null;
  }

}
