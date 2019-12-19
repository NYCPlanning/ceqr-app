import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationTdfInOutSplitsComponent extends Component {
  classNames = ["row"];

  @alias('factor.inOutSplits') data;
}
