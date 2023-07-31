import Component from '@ember/component';

export default class TransportationTrafficZoneThreshold extends Component {
  tagName = '';
  constructor() {
    super(...arguments);

    this.trafficZonesView = 'thresholds';
  }
}
