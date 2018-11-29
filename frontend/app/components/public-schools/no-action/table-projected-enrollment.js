import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../../../decorators/SchoolLevelTotals';

export default Component.extend({
  psTable: computed('analysis.aggregateTotals.@each', function() {
    return this.analysis.aggregateTotals.filterBy('level', 'ps');
  }),

  psTableTotals: computed('analysis.aggregateTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.analysis.aggregateTotals.filterBy('level', 'ps')
    });
  }),

  isTable: computed('analysis.aggregateTotals.@each', function() {
    return this.analysis.aggregateTotals.filterBy('level', 'is');
  }),

  isTableTotals: computed('analysis.aggregateTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.analysis.aggregateTotals.filterBy('level', 'is')
    });
  }),

  hsTable: computed('analysis.aggregateTotals.@each', function() {
    return this.analysis.aggregateTotals.filterBy('level', 'hs');
  }),

  hsTableTotals: computed('analysis.aggregateTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.analysis.aggregateTotals.filterBy('level', 'hs')
    });
  }),
});
