import Component from '@ember/component';
import { action } from '@ember/object';

export default class TransportationTdfInOutSplitsTableRowComponent extends Component {
  tagName = 'tr';

  @action
  syncIn(value) {
    this.set('data.in', 100 - value);
  }

  @action
  syncOut(value) {
    this.set('data.out', 100 - value);
  }
}
