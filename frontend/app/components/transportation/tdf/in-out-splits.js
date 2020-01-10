import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfInOutSplitsComponent extends Component {
  classNames = ['row'];

  @alias('factor.inOutSplits') data;
}
