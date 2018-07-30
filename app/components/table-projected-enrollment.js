import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../decorators/SchoolLevelTotals';

export default Component.extend({
  psTable: computed('project.aggregateTotals.@each', function() {
    return this.get('project.aggregateTotals').filterBy('level', 'ps');
  }),

  psTableTotals: computed('project.aggregateTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.aggregateTotals').filterBy('level', 'ps')
    });
  }),

  isTable: computed('project.aggregateTotals.@each', function() {
    return this.get('project.aggregateTotals').filterBy('level', 'is');
  }),

  isTableTotals: computed('project.aggregateTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.aggregateTotals').filterBy('level', 'is')
    });
  }),

  hsTable: computed('project.aggregateTotals.@each', function() {
    return this.get('project.aggregateTotals').filterBy('level', 'hs');
  }),

  hsTableTotals: computed('project.aggregateTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.get('project.aggregateTotals').filterBy('level', 'hs')
    });
  }),
});
