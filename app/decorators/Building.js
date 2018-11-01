import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({      
  seats: computed('excluded', 'enroll', 'capacity', function() {
    if (this.excluded) return Math.round(0 - this.enroll);
    if (!this.capacity) return 0;
    return Math.round(this.capacity - this.enroll);
  }),
  
  utilization: computed('excluded', 'enroll', 'capacity', function() {
    return round((this.enroll / this.capacity), 3);
  }),

  capacityDelta: computed('capacity', 'capacityFuture', function() {
    return this.capacityFuture - this.capacity;
  })
});
