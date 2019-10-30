import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action } from '@ember-decorators/object';

export default class TransportationTdfVehicleOccupancyComponent extends Component {
  classNames = ["row"];

  @alias('factor.vehicleOccupancy') vehicleOccupancy;

  @action
  saveFactor() {
    this.factor.save();
  }
}
