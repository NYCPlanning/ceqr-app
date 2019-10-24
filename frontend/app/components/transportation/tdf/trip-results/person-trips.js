import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class TransportationTdfTripResultsPersonTripsComponent extends Component {
  @computed('modes', 'results')
  get rows() {
    return this.modes.map((mode) => {
      return { 
        mode,
        ...this.results[mode],
      }
    });
  }

  @computed('modes', 'results')
  get total() {
    return this.results["total"];
  }
}
