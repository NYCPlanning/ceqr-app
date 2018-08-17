import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({
  enrollNoAction: computed('enroll', 'students', function() {
    return this.get('enroll') + this.get('students');
  }),
  enrollNoActionDelta: computed('enrollNoAction', 'enrollExistingConditions', function() {
    return this.get('enrollNoAction') - this.get('enrollExistingConditions');
  }),
  enrollWithAction: computed('studentsWithAction', function() {
    return this.get('enrollNoAction') + this.get('studentsWithAction');
  }),
  enrollWithActionDelta: computed('enrollWithAction', 'enrollExistingConditions', function() {
    return this.get('enrollWithAction') - this.get('enrollExistingConditions');
  }),
  enrollDifference: computed('enrollNoAction', 'enrollWithAction', function() {
    return this.get('enrollWithAction') - this.get('enrollNoAction');
  }),
  enrollDeltaDifference: computed('enrollNoActionDelta', 'enrollWithActionDelta', function() {
    return this.get('enrollWithActionDelta') - this.get('enrollNoActionDelta');
  }),


  capacityNoAction: computed('capacityExisting', 'scaCapacityIncrease', function() {
    return this.get('capacityExisting') + this.get('scaCapacityIncrease');
  }),
  capacityNoActionDelta: computed('capacityExisting', 'capacityNoAction', function() {
    return this.get('capacityNoAction') - this.get('capacityExisting');
  }),
  capacityWithAction: computed('', function() {
    return this.get('capacityNoAction');
  }),
  capacityWithActionDelta: computed('capacityExisting', 'capacityNoAction', function() {
    return this.get('capacityWithAction') - this.get('capacityExisting');
  }),
  capacityDifference: computed('capacityNoAction', 'capacityWithAction', function() {
    return this.get('capacityWithAction') - this.get('capacityNoAction');
  }),
  capacityDeltaDifference: computed('capacityNoActionDelta', 'capacityWithActionDelta', function() {
    return this.get('capacityWithActionDelta') - this.get('capacityNoActionDelta');
  }),


  seatsNoAction: computed('capacityNoAction', 'enrollNoAction', function() {
    return this.get('capacityNoAction') - this.get('enrollNoAction');
  }),
  seatsWithAction: computed('capacityNoAction', 'enrollWithAction', function() {
    return this.get('capacityNoAction') - this.get('enrollWithAction');
  }),
  seatsDifference: computed('seatsNoAction', 'seatsWithAction', function() {
    return this.get('seatsWithAction') - this.get('seatsNoAction');
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