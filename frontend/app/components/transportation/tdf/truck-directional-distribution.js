import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action } from '@ember-decorators/object';

export default class TransportationTdfTruckDirectionalDistributionComponent extends Component {
  classNames = ["row"];

  @alias('factor.truckInOutSplits') data;

  @action
  saveFactor() {
    this.factor.save();
  }
}
