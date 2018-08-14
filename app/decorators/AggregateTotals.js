import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({
  enrollNoAction: computed('enroll', 'students', function() {
    return this.get('enroll') + this.get('students');
  }),

  enrollWithAction: computed('studentsWithAction', function() {
    return this.get('enrollNoAction') + this.get('studentsWithAction');
  }),

  capacityNoAction: computed('capacityExisting', 'scaCapacityIncrease', function() {
    return this.get('capacityExisting') + this.get('scaCapacityIncrease');
  }),

  capacityWithAction: computed('', function() {
    return this.get('capacityNoAction');
  }),

  seatsNoAction: computed('capacityNoAction', 'enrollNoAction', function() {
    return this.get('capacityNoAction') - this.get('enrollNoAction');
  }),

  seatsWithAction: computed('capacityNoAction', 'enrollWithAction', function() {
    return this.get('capacityNoAction') - this.get('enrollWithAction');
  }),

  utilizationNoAction: computed('enrollNoAction', function() {
    return round(this.get('enrollNoAction') / this.get('capacityNoAction'), 3);
  }),

  utilizationWithAction: computed('enrollWithAction', function() {
    return round(this.get('enrollWithAction') / this.get('capacityNoAction'), 3);
  }),

  utilizationChange: computed('utilizationWithAction', 'utilizationNoAction', function() {
    return round(this.get('utilizationWithAction') - this.get('utilizationNoAction'), 4);
  }),

  impact: computed('utilizationChange', 'utilizationWithAction', function() {
    return (
      (this.get('utilizationChange') >= 0.05)
      &&
      (this.get('utilizationWithAction') >= 1)
    );
  })
});