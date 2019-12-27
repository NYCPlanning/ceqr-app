import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationTdfTruckDirectionalDistributionComponent extends Component {
  classNames = ["row"];

  @alias('factor.truckInOutSplits') data;
}
