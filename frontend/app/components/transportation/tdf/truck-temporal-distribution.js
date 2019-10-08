import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationTdfTruckTemporalDistributionComponent extends Component {
  classNames = ["row"];

  @alias('factor.ceqrManualDefaults.truckTemporalDistribution') data;
}
