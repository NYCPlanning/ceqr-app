import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TransportationTripGenerationTablesModalSplitsVehicleOccupancyComponent extends Component {

  // The project's transportation analysis object.
  // Must be passed from parent component.
  analysis = {}

  @action
  saveAnalysis(){
    this.analysis.save();
  }

}
