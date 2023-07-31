import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default class TransportationTdfInOutSplitsComponent extends Component {
  tagName = '';
  classNames = ['row'];

  @alias('factor.inOutSplits') data;
}
