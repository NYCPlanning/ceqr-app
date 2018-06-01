import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({
  enrollTotal: computed('enroll', 'students', function() {
    return this.get('enroll') + this.get('students');
  }),

  capacityTotal: computed('capacityExisting', function() {
    return this.get('capacityExisting');
  }),

  seats: computed('capacityTotal', 'enrollTotal', function() {
    return this.get('capacityTotal') - this.get('enrollTotal');
  }),

  utilization: computed('', function() {
    return round(this.get('enrollTotal') / this.get('capacityTotal'), 3);
  })
});