import Component from '@ember/component';
import { computed } from '@ember/object';
import LevelTotals from '../../../fragments/public-schools/LevelTotals';

export default Component.extend({
  ps: computed('analysis.{subdistrictTotals,schoolsWithAction}.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.get('analysis.subdistrictTotals').filterBy('level', 'ps'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('ps_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  is: computed('analysis.{subdistrictTotals,schoolsWithAction}.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.get('analysis.subdistrictTotals').filterBy('level', 'is'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('is_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  hs: computed('analysis.{subdistrictTotals,schoolsWithAction}.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.get('analysis.subdistrictTotals').filterBy('level', 'hs'),
      newSchoolSeats: this.get('analysis.schoolsWithAction').mapBy('hs_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  })
});
