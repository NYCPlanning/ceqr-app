import Component from '@ember/component';
import { computed } from '@ember/object';
import LevelTotals from '../../../fragments/public-schools/LevelTotals';

export default Component.extend({
  psTable: computed('analysis.subdistrictTotals.@each', function() {
    return this.analysis.subdistrictTotals.filterBy('level', 'ps');
  }),

  psTableTotals: computed('analysis.subdistrictTotals.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.analysis.subdistrictTotals.filterBy('level', 'ps')
    });
  }),

  isTable: computed('analysis.subdistrictTotals.@each', function() {
    return this.analysis.subdistrictTotals.filterBy('level', 'is');
  }),

  isTableTotals: computed('analysis.subdistrictTotals.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.analysis.subdistrictTotals.filterBy('level', 'is')
    });
  }),

  hsTable: computed('analysis.subdistrictTotals.@each', function() {
    return this.analysis.subdistrictTotals.filterBy('level', 'hs');
  }),

  hsTableTotals: computed('analysis.subdistrictTotals.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.analysis.subdistrictTotals.filterBy('level', 'hs')
    });
  }),
});
