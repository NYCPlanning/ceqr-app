import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class TransportationTdfModalSplitsTableRowComponent extends Component {
  tagName = 'tr';

  @computed('showData', 'mode')
  get modeCount() {
    return this.showData[this.mode]['count'];
  }

  @computed('showData', 'editData', 'mode')
  get modePercent() {
    return this.showData[this.mode]['allPeriods'];
  }
  set modePercent(value) {
    this.editData.set(`${this.mode}.allPeriods`, value);
  }
}
