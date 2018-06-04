import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({
  enrollTotal: computed('enroll', 'students', function() {
    return this.get('enroll') + this.get('students');
  }),

  capacityFuture: computed('capacityExisting', 'scaCapacityIncrease', function() {
    return this.get('capacityExisting') + this.get('scaCapacityIncrease');
  }),

  seats: computed('capacityFuture', 'enrollTotal', function() {
    return this.get('capacityFuture') - this.get('enrollTotal');
  }),

  utilization: computed('', function() {
    return round(this.get('enrollTotal') / this.get('capacityFuture'), 3);
  })
});