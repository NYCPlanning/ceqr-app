import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfTemporalDistributionComponent extends Component {
  tagName = '';
  classNames = ['row'];

  @alias('factor.defaults.temporalDistribution') data;
}
