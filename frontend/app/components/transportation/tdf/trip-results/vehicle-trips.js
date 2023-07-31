import Component from '@ember/component';
import { computed, action, toggleProperty } from '@ember/object';

export default class TransportationTdfTripResultsVehicleTripsComponent extends Component {
  tagName = '';
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
    toggleProperty(this, 'balancedTaxi');
  }
}
