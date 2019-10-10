import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action, computed } from '@ember-decorators/object';

export default class TransportationTdfModalSplitsComponent extends Component {
  classNames = ["row"];

  editModes = false;

  @alias('factor.calculatedModeSplits') showData;
  @alias('factor.modeSplits') editData;

  @alias('factor.modeSplitsFromUser') modeSplitsFromUser;

  @alias('factor.activeModes') activeModes;
  @alias('factor.inactiveModes') inactiveModes;

  // Compute when any land use is changed
  @computed('factor.calculatedModeSplits.{auto,taxi,bus,subway,railroad,walk,ferry,streetcar,bicycle,motorcycle,other}.allPeriods')
  get totalPercent() {
    return this.factor.modesForAnalysis.reduce((pv, key) => pv + parseFloat(this.showData[key].allPeriods), 0);
  }

  @action
  saveFactor() {
    this.factor.save();
  }

  @action
  toggleEditModes() {
    this.toggleProperty("editModes");
  }

  @action
  addActiveMode(event) {
    this.factor.modesForAnalysis.push(event.value);
    this.factor.save();
  }

  @action
  removeActiveMode(event) {
    const modes = this.factor.modesForAnalysis.without(event.value);

    this.factor.set('modesForAnalysis', modes);
    this.factor.save();
  }
}
