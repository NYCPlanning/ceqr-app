import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action } from '@ember-decorators/object';

export default class TransportationTdfVehicleOccupancyComponent extends Component {
  classNames = ["row"];

  @alias('factor.vehicleOccupancy') vehicleOccupancy;

  @action
  setIsEditing() {
    // set isEditing to true in order to enable the save button
    // isEditing will be set to false once the user has clicked the save button in the land use menu...
    // which will disable the save button
    // model.hasDirtyAttributes does not work on nested objects in a model, so this is required for
    // checking whether the model has been changed BUT not saved to the server
    this.set('model.transportationPlanningFactor.isEditing', true);
  }

  @action
  toggleTemporalVehicleOccupancy(bool) {
    this.factor.set('temporalVehicleOccupancy', bool);

    this.factor.save();
  }
}
