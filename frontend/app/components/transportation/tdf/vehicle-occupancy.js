import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action } from '@ember-decorators/object';

export default class TransportationTdfVehicleOccupancyComponent extends Component {
  classNames = ["row"];

  @alias('factor.calculatedVehicleOccupancy') showData;
  @alias('factor.vehicleOccupancy') editData;

  @action
  saveFactor() {
    this.factor.save();
  }
}
