import Component from '@ember/component';
import { alias } from '@ember-decorators/object/computed';
import { action, computed } from '@ember-decorators/object';
import { task, taskGroup } from 'ember-concurrency-decorators';

export default class TransportationTdfModalSplitsComponent extends Component {
  classNames = ["row"];

  editModes = false;
  seeCensusTracts = false;

  @alias('factor.modeSplits') modeSplits;
  @alias('factor.censusTractVariables') censusTractVariables;

  @alias('factor.manualModeSplits') manualModeSplits;

  @alias('factor.activeModes') activeModes;
  @alias('factor.inactiveModes') inactiveModes;

  // Compute when any land use is changed
  @computed('activeModes', 'modeSplits.{auto,taxi,bus,subway,railroad,walk,ferry,streetcar,bicycle,motorcycle,other}.allPeriods')
  get total() {
    return {
      percent: Math.round(this.factor.modesForAnalysis.reduce((pv, key) => pv + parseFloat(this.modeSplits[key].allPeriods), 0)),
      count:   this.factor.modesForAnalysis.reduce((pv, key) => pv + parseFloat(this.modeSplits[key].count), 0)
    }
  }

  @action
  toggleManualModeSplits() {
    this.factor.set('manualModeSplits', true);
    this.set('seeCensusTracts', false);

    this.factor.save();
  }

  @action
  toggleCensusTractModeSplits() {
    this.factor.set('manualModeSplits', false);

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
    this.analysis.modesForAnalysis.push(event.value);
    this.analysis.save();
  }

  @action
  removeActiveMode(event) {
    const modes = this.analysis.modesForAnalysis.without(event.value);

    this.analysis.set('modesForAnalysis', modes);
    this.analysis.save();
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

  @action
  changeDataPackage(dp) {
    this.factor.set('dataPackage', dp);
    this.saveFactorAndRefresh.perform();
  }

  // Ember Concurrency Tasks and Groups
  @taskGroup censusTracksChanging;

  @task({ group: 'censusTracksChanging' })
  *saveAnalysisAndRefreshFactor() {
    yield this.analysis.save();
    yield this.analysis.transportationPlanningFactors.forEach((factor) => factor.reload());
  }

  @task({ group: 'censusTracksChanging' })
  *saveFactorAndRefresh() {
    yield this.factor.save();
  }
}
