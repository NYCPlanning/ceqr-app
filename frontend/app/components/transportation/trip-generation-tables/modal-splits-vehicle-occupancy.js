import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TransportationTripGenerationTablesModalSplitsVehicleOccupancyComponent extends Component {

  // The project's transportation analysis object.
  // Must be passed from parent component.
  analysis = {}

  modalSplitVariablesSubset = [
    'trans_auto_total',
    'trans_taxi',
    'trans_public_bus',
    'trans_public_subway',
    'trans_walk',
  ]

  @action
  saveAnalysis(){
    this.analysis.save();
  }

}
