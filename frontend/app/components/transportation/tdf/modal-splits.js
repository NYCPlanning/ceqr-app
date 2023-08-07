import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { action, computed, set } from '@ember/object';
import { task, taskGroup } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class TransportationTdfModalSplitsComponent extends Component {
  tagName = '';
  classNames = ['row'];

  @tracked editModes = false;

  seeCensusTracts = false;

  @alias('factor.modeSplits') modeSplits;

  @alias('factor.censusTractVariables') censusTractVariables;

  @alias('factor.manualModeSplits') manualModeSplits;

  @alias('factor.activeModes') activeModes;

  @alias('factor.inactiveModes') inactiveModes;

  // Compute when any land use is changed
  @computed(
    'activeModes',
    'factor.modesForAnalysis',
    'modeSplits.{other,auto,bicycle,bus,ferry,motorcycle,railroad,streetcar,subway,taxi,walk}'
  )
  get total() {
    // modesForAnalysis = e.g. ['auto', 'taxi', 'bus', 'subway', 'walk', 'railroad']
    // modeSplits = e.g. { auto: { allPeriods: 10.1, count: 2712 }, taxi: { allPeriods: 3.6, count: 981 } }
    // reduce function to add up the am/md/pm/saturday/allPeriods values for each mode in the modesForAnalysis array
    // example: auto saturday value + taxi saturday value + bus saturday value + subway saturday value
    return {
      allPeriods: this.factor.modesForAnalysis.reduce(
        (pv, key) => pv + parseFloat(this.modeSplits[key].allPeriods),
        0
      ),
      am: this.factor.modesForAnalysis.reduce(
        (pv, key) => pv + parseFloat(this.modeSplits[key].am),
        0
      ),
      md: this.factor.modesForAnalysis.reduce(
        (pv, key) => pv + parseFloat(this.modeSplits[key].md),
        0
      ),
      pm: this.factor.modesForAnalysis.reduce(
        (pv, key) => pv + parseFloat(this.modeSplits[key].pm),
        0
      ),
      saturday: this.factor.modesForAnalysis.reduce(
        (pv, key) => pv + parseFloat(this.modeSplits[key].saturday),
        0
      ),
      count: this.factor.modesForAnalysis.reduce(
        (pv, key) => pv + parseFloat(this.modeSplits[key].count),
        0
      ),
    };
  }

  @action
  toggleManualModeSplits() {
    this.factor.set('manualModeSplits', true);
    set(this, 'seeCensusTracts', false);

    this.factor.save();
  }

  @action
  toggleCensusTractModeSplits() {
    this.factor.set('manualModeSplits', false);

    this.factor.save();
  }

  @action
  toggleTemporalModeSplits(bool) {
    this.factor.set('temporalModeSplits', bool);

    this.factor.save();
  }

  @action
  saveFactor() {
    this.factor.save();
  }

  @action
  toggleEditModes() {
    this.editModes = !this.editModes;
  }

  @action
  toggleSeeCensusTracts(bool) {
    set(this, 'seeCensusTracts', bool);
  }

  @action
  addActiveMode(mode) {
    this.analysis.modesForAnalysis.push(mode);
    this.analysis.save();
  }

  @action
  removeActiveMode(mode) {
    const modes = this.analysis.modesForAnalysis.without(mode);

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
    this.analysis.set(
      'censusTractsSelection',
      this.analysis.censusTractsSelection.without(tract)
    );
    this.saveAnalysisAndRefreshFactor.perform();
  }

  @action
  changeDataPackage(dp) {
    this.factor.set('dataPackage', dp);
    this.saveFactorAndRefresh.perform();
  }

  // Ember Concurrency Tasks and Groups
  @taskGroup censusTracksChanging;

  @task({ group: 'censusTracksChanging' }) *saveAnalysisAndRefreshFactor() {
    yield this.analysis.save();
    yield this.analysis.transportationPlanningFactors.forEach((factor) =>
      factor.reload()
    );
  }

  @task({ group: 'censusTracksChanging' }) *saveFactorAndRefresh() {
    yield this.factor.save();
  }
}
