import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfTruckTemporalDistributionComponent extends Component {
  tagName = '';
  classNames = ['row'];

  @alias('factor.defaults.truckTemporalDistribution') data;
}
