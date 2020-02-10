import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  // ceqr_school_buildings dataset is a combination of two datasets with different metadata: lcgms dataset and bluebook dataset
  lcgmsMetadata: computed('analysis.dataPackage.schemas.ceqr_school_buildings.sources', function() {
    return this.analysis.dataPackage.schemas.ceqr_school_buildings.sources.find((source) => source.name === 'lcgms');
  }),

  actions: {
    save() {
      this.set('saving', true);
      this.get('project').save().then(() => this.set('saving', false));
    },
  },
});
