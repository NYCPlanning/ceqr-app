import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action, computed } from '@ember-decorators/object';
import { task, taskGroup } from 'ember-concurrency-decorators';

export default class TransportationTdfModalSplitsComponent extends Component {
  classNames = ["row"];

  editModes = false;
  seeCensusTracts = false;

  @alias('factor.calculatedModeSplits') showData;
  @alias('factor.modeSplits') editData;
  @alias('factor.censusTractVariables') censusTractVariables;

  @alias('factor.modeSplitsFromUser') modeSplitsFromUser;

  @alias('factor.activeModes') activeModes;
  @alias('factor.inactiveModes') inactiveModes;

  // Compute when any land use is changed
  @computed('activeModes', 'calculatedModeSplits.{auto,taxi,bus,subway,railroad,walk,ferry,streetcar,bicycle,motorcycle,other}.allPeriods')
  get total() {
    return {
      percent: Math.round(this.factor.modesForAnalysis.reduce((pv, key) => pv + parseFloat(this.showData[key].allPeriods), 0)),
      count:   this.factor.modesForAnalysis.reduce((pv, key) => pv + parseFloat(this.showData[key].count), 0)
    }
  }

  @action
  toggleManualModeSplits() {
    this.factor.set('modeSplitsFromUser', true);
    this.set('seeCensusTracts', false);

    this.factor.save();
  }

  @action
  toggleCensusTractModeSplits() {
    this.factor.set('modeSplitsFromUser', false);

    this.factor.save();
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
  toggleSeeCensusTracts() {
    this.toggleProperty("seeCensusTracts");
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

  @action
  addCensusTract(tract) {    
    this.analysis.censusTractsSelection.push(tract);
    this.saveAnalysisAndRefreshFactor.perform();
  }

  @action
  removeCensusTract(tract) {    
    this.analysis.set('censusTractsSelection', this.analysis.censusTractsSelection.without(tract));
    this.saveAnalysisAndRefreshFactor.perform();
  }

  // Ember Concurrency Tasks and Groups
  @taskGroup censusTracksChanging;

  @task({ group: 'censusTracksChanging' })
  *saveAnalysisAndRefreshFactor() {
    yield this.analysis.save();
    yield this.factor.reload();
  }
}
