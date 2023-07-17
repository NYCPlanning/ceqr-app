import Component from '@ember/component';
import { computed, action } from '@ember/object';

export default class TransportationTdfTripResultsVehicleTripsComponent extends Component {
  balancedTaxi = true;

  @computed('vehicleTrips')
  get rows() {
    const modes = Object.keys(this.vehicleTrips).without('total');

    return modes.map((mode) => ({
      mode,
      ...this.vehicleTrips[mode],
    }));
  }

  @computed('vehicleTrips.total')
  get total() {
    return this.vehicleTrips.total;
  }

  @action
  toggleBalancedTaxi() {
    this.toggleProperty('balancedTaxi');
  }
}
