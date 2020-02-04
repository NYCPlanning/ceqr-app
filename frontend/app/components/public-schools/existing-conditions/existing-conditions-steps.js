import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  displayWarning: computed('analysis.{esSchoolChoice,isSchoolChoice,subdistrictsFromDb}', function() {
    return (
      this.analysis.esSchoolChoice
      || this.analysis.isSchoolChoice
      || this.analysis.subdistrictsFromDb.length > 1
    );
  }),

  newlyOpenedSchools: computed('analysis.ceqr_school_buildings', function() {
    return this.analysis.ceqr_school_buildings.find((school) => school.source === 'lcgms');
  }),
});
