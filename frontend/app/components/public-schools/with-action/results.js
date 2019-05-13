import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../../../fragments/public-schools/SchoolLevelTotals';

export default Component.extend({
  ps: computed('analysis.{aggregateTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('analysis.aggregateTotals').filterBy('level', 'ps'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('ps_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  is: computed('analysis.{aggregateTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('analysis.aggregateTotals').filterBy('level', 'is'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('is_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  hs: computed('analysis.{aggregateTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('analysis.aggregateTotals').filterBy('level', 'hs'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('hs_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  })
});
