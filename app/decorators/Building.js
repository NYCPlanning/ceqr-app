import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({      
  seats: computed('excluded', 'enroll', 'capacity', function() {
    if (this.get('excluded')) return Math.round(0 - this.get('enroll'));
    if (!this.get('capacity')) return 0;
    return Math.round(this.get('capacity') - this.get('enroll'));
  }),
  
  utilization: computed('excluded', 'enroll', 'capacity', function() {
    if (this.get('excluded')) return null;
    if (!this.get('capacity')) return 0;
    return round((this.get('enroll') / this.get('capacity')), 3);
  }),

  capacityDelta: computed('capacity', 'capacityFuture', function() {
    return this.get('capacityFuture') - this.get('capacity');
  })
});
