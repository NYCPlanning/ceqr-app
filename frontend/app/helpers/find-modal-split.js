import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

/**
 * Helper for NeedsAsync component that wraps async call to get modal split data
 * in a task for async conditional rendering
 */
export default Helper.extend({
  /**
   * The readonly-ceqr-data-store where modal-split objects are stored
   */
  readonlyStore: service('readonly-ceqr-data-store'),

  /**
   * Task that wraps async call to get modal-split record from store
   */
  findModalSplitTask: task(function * (geoid) {
      return yield Promise.all([
        this.readonlyStore.find('ACS-modal-split', geoid),
        this.readonlyStore.find('CTPP-modal-split', geoid),
      ]);
  }),

  /**
   * Main helper 'compute' function
   */ 
  compute(params) {
    const [geoid] = params;
    if (!geoid) return null;
    return this.findModalSplitTask.perform(geoid);
  }
});
