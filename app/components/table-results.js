import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../decorators/SchoolLevelTotals';

export default Component.extend({
  psTable: computed('project.noActionTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.noActionTotals').filterBy('level', 'ps')
    });
  }),

  isTable: computed('project.noActionTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.noActionTotals').filterBy('level', 'is')
    });
  }),

  hsTable: computed('project.noActionTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.noActionTotals').filterBy('level', 'hs')
    });
  })
});
