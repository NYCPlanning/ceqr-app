import Component from '@ember/component';
import { computed } from '@ember/object';
import SchoolLevelTotals from '../../../fragments/public-schools/SchoolLevelTotals';

export default Component.extend({
  psTable: computed('analysis.subdistrictLevelTotals.@each', function() {
    return this.analysis.subdistrictLevelTotals.filterBy('level', 'ps');
  }),

  psTableTotals: computed('analysis.subdistrictLevelTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.analysis.subdistrictLevelTotals.filterBy('level', 'ps')
    });
  }),

  isTable: computed('analysis.subdistrictLevelTotals.@each', function() {
    return this.analysis.subdistrictLevelTotals.filterBy('level', 'is');
  }),

  isTableTotals: computed('analysis.subdistrictLevelTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.analysis.subdistrictLevelTotals.filterBy('level', 'is')
    });
  }),

  hsTable: computed('analysis.subdistrictLevelTotals.@each', function() {
    return this.analysis.subdistrictLevelTotals.filterBy('level', 'hs');
  }),

  hsTableTotals: computed('analysis.subdistrictLevelTotals.@each', function() {
    return SchoolLevelTotals.create({
      subdistricts: this.analysis.subdistrictLevelTotals.filterBy('level', 'hs')
    });
  }),
});
