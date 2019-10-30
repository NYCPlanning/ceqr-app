import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class TransportationTdfModalSplitsTableRowComponent extends Component {
  tagName = 'tr';

  @computed('modeSplits', 'mode')
  get modeCount() {
    return this.modeSplits[this.mode]['count'];
  }

  @computed('modeSplits', 'mode')
  get modePercent() {
    return this.modeSplits[this.mode]['allPeriods'];
  }
  set modePercent(value) {
    this.modeSplits.set(`${this.mode}.allPeriods`, value);
  }
}
