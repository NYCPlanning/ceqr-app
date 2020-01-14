import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfTruckDirectionalDistributionComponent extends Component {
  classNames = ['row'];

  @alias('factor.truckInOutSplits') data;
}
