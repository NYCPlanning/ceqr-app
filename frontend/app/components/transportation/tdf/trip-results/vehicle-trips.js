import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TransportationTdfTripResultsVehicleTripsComponent extends Component {
  tagName = '';

  @tracked balancedTaxi = true;

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
    this.balancedTaxi = !this.balancedTaxi;
  }
}
