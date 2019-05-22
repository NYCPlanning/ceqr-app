import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../../../fragments/public-schools/SchoolLevelTotals';

export default Component.extend({
  ps: computed('analysis.{subdistrictLevelTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('analysis.subdistrictLevelTotals').filterBy('level', 'ps'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('ps_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  is: computed('analysis.{subdistrictLevelTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('analysis.subdistrictLevelTotals').filterBy('level', 'is'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('is_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  hs: computed('analysis.{subdistrictLevelTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('analysis.subdistrictLevelTotals').filterBy('level', 'hs'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('hs_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  })
});
