import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { getAggregateValue } from '../../../helpers/get-aggregate-value';

export default class TransportationTripGenerationTablesModalSplitsVehicleOccupancyComponent extends Component {
  tagName = '';
  // The project's transportation analysis object.
  // Must be passed from parent component.
  analysis = {};

  @action
  saveAnalysis() {
    this.analysis.save();
  }

  @computed('selectedCensusTractData.length')
  get vehicleOccupancy() {
    if (this.selectedCensusTractData) {
      return (
        getAggregateValue([
          this.selectedCensusTractData,
          ['vehicle_occupancy'],
        ]) / this.selectedCensusTractData.length
      );
    }
    return null;
  }
}
