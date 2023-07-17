import Component from '@ember/component';
import { computed } from '@ember/object';

export default class TransportationTdfTripResultsPersonTripsComponent extends Component {
  @computed('modes', 'results')
  get rows() {
    return this.modes.map((mode) => ({
      mode,
      ...this.results[mode],
    }));
  }

  @computed('modes', 'results.total')
  get total() {
    return this.results.total;
  }
}
