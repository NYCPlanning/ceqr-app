import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../decorators/SchoolLevelTotals';

export default Component.extend({
  psTable: computed('project.{noActionTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.noActionTotals').filterBy('level', 'ps'),
      newSchoolSeats: this.get('project.schoolsWithAction').mapBy('ps_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  isTable: computed('project.{noActionTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.noActionTotals').filterBy('level', 'is'),
      newSchoolSeats: this.get('project.schoolsWithAction').mapBy('is_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  }),

  hsTable: computed('project.{noActionTotals,schoolsWithAction}.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.noActionTotals').filterBy('level', 'hs'),
      newSchoolSeats: this.get('project.schoolsWithAction').mapBy('hs_seats').reduce((a, v) => a + parseInt(v), 0)
    });
  })
});
