import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  ps_students: computed('multipliers.ps', 'total_units', function () {
    return Math.round(this.total_units * this.multipliers.ps);
  }),

  is_students: computed('multipliers.is', 'total_units', function () {
    return Math.round(this.total_units * this.multipliers.is);
  }),

  hs_students: computed('multipliers.hs', 'total_units', function () {
    return Math.round(this.total_units * this.multipliers.hs);
  }),
});
