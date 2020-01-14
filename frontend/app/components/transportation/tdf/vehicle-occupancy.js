import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class TransportationTdfVehicleOccupancyComponent extends Component {
  classNames = ['row'];

  @alias('factor.vehicleOccupancy') vehicleOccupancy;

  @action
  toggleTemporalVehicleOccupancy(bool) {
    this.factor.set('temporalVehicleOccupancy', bool);

    this.factor.save();
  }
}
