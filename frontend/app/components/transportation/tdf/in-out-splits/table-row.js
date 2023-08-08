import Component from '@ember/component';
import { action, set } from '@ember/object';

export default class TransportationTdfInOutSplitsTableRowComponent extends Component {
  tagName = 'tr';

  @action
  syncIn(e) {
    const { value } = e.target;
    set(this, 'data.in', 100 - value);
  }

  @action
  syncOut(e) {
    const { value } = e.target;
    set(this, 'data.out', 100 - value);
  }
}
