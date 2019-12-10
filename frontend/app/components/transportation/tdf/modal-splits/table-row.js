import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class TransportationTdfModalSplitsTableRowComponent extends Component {
  tagName = 'tr';

  @computed('modeSplits', 'mode')
  get count() {
    return this.modeSplits[this.mode]['count'];
  }

  @computed('modeSplits', 'mode')
  get allPeriodPercent() {
    return this.modeSplits[this.mode]['allPeriods'];
  }
  set allPeriodPercent(value) {
    this.modeSplits.set(`${this.mode}.allPeriods`, value);
  }

  @computed('modeSplits', 'mode')
  get amPercent() {
    return this.modeSplits[this.mode]['am'];
  }
  set amPercent(value) {
    this.modeSplits.set(`${this.mode}.am`, value);
  }

  @computed('modeSplits', 'mode')
  get mdPercent() {
    return this.modeSplits[this.mode]['md'];
  }
  set mdPercent(value) {
    this.modeSplits.set(`${this.mode}.md`, value);
  }

  @computed('modeSplits', 'mode')
  get pmPercent() {
    return this.modeSplits[this.mode]['pm'];
  }
  set pmPercent(value) {
    this.modeSplits.set(`${this.mode}.pm`, value);
  }

  @computed('modeSplits', 'mode')
  get satPercent() {
    return this.modeSplits[this.mode]['saturday'];
  }
  set satPercent(value) {
    this.modeSplits.set(`${this.mode}.saturday`, value);
  }
}
