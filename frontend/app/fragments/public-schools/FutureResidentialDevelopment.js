import { computed } from EmberObject from '@ember/object';


export default EmberObject.extend({
  ps_students: computed('multipliers', function() {
    return Math.round(this.total_units * this.multipliers.ps);
  }),

  is_students: computed('multipliers', function() {
    return Math.round(this.total_units * this.multipliers.is);
  }),

  hs_students: computed('multipliers', function() {
    return Math.round(this.total_units * this.multipliers.hs);
  }),
});
