import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  newlyOpenedSchools: computed('analysis.ceqr_school_buildings', function() {
    return this.analysis.ceqr_school_buildings.find((school) => school.source === 'lcgms');
  }),

  doeLcgmsMetadata: computed('analysis.dataPackage.schemas.ceqr_school_buildings.sources', function() {
    return this.analysis.dataPackage.schemas.ceqr_school_buildings.sources.find((source) => source.name === 'lcgms');
  }),

  actions: {
    save() {
      this.set('saving', true);
      this.get('project').save().then(() => this.set('saving', false));
    },
  },
});
