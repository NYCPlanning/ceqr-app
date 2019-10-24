import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationTdfTemporalDistributionComponent extends Component {
  classNames = ["row"];

  @alias('factor.defaults.temporalDistribution') data;
}
