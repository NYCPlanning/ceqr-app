import Component from '@ember/component';
import { computed } from '@ember/object';
import LevelTotals from '../../../fragments/public-schools/LevelTotals';

export default Component.extend({
  psTable: computed('analysis.subdistrictLevelTotals.@each', function() {
    return this.analysis.subdistrictLevelTotals.filterBy('level', 'ps');
  }),

  psTableTotals: computed('analysis.subdistrictLevelTotals.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.analysis.subdistrictLevelTotals.filterBy('level', 'ps')
    });
  }),

  isTable: computed('analysis.subdistrictLevelTotals.@each', function() {
    return this.analysis.subdistrictLevelTotals.filterBy('level', 'is');
  }),

  isTableTotals: computed('analysis.subdistrictLevelTotals.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.analysis.subdistrictLevelTotals.filterBy('level', 'is')
    });
  }),

  hsTable: computed('analysis.subdistrictLevelTotals.@each', function() {
    return this.analysis.subdistrictLevelTotals.filterBy('level', 'hs');
  }),

  hsTableTotals: computed('analysis.subdistrictLevelTotals.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.analysis.subdistrictLevelTotals.filterBy('level', 'hs')
    });
  }),
});
