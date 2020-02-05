import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  // ceqr_school_buildings dataset is a combination of lcgms and bluebook datasets
  // lcgms dataset represents schools that were opened recently
  newlyOpenedSchools: computed('analysis.ceqr_school_buildings', function() {
    return this.analysis.ceqr_school_buildings.find((school) => school.source === 'lcgms');
  }),

  displayWarning: computed('analysis.{esSchoolChoice,isSchoolChoice,subdistrictsFromDb}', function() {
    return (
      this.analysis.esSchoolChoice
      || this.analysis.isSchoolChoice
      || this.analysis.subdistrictsFromDb.length > 1
    );
  }),
});
