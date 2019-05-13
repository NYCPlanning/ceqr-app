import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../../utils/round';

export default EmberObject.extend({
  enrollExistingConditions: computed('schoolTotals', function() {
    return this.schoolTotals.enrollmentTotal;
  }),
  enrollNoAction: computed('enroll', 'students', function() {
    return this.enroll + this.students;
  }),
  enrollNoActionDelta: computed('enrollNoAction', 'enrollExistingConditions', function() {
    return this.enrollNoAction - this.enrollExistingConditions;
  }),
  enrollWithAction: computed('studentsWithAction', function() {
    return this.enrollNoAction + this.studentsWithAction;
  }),
  enrollWithActionDelta: computed('enrollWithAction', 'enrollExistingConditions', function() {
    return this.enrollWithAction - this.enrollExistingConditions;
  }),
  enrollDifference: computed('enrollNoAction', 'enrollWithAction', function() {
    return this.enrollWithAction - this.enrollNoAction;
  }),
  enrollDeltaDifference: computed('enrollNoActionDelta', 'enrollWithActionDelta', function() {
    return this.enrollWithActionDelta - this.enrollNoActionDelta;
  }),

  capacityExisting: computed('schoolTotals', function() {
    return this.schoolTotals.capacityTotal;
  }),
  capacityFuture: computed('schoolTotals', function() {    
    return this.schoolTotals.capacityTotalNoAction;
  }),
  capacityNoAction: computed('capacityFuture', 'scaCapacityIncrease', function() {
    return this.capacityFuture + this.scaCapacityIncrease;
  }),
  capacityNoActionDelta: computed('capacityExisting', 'capacityNoAction', function() {
    return this.capacityNoAction - this.capacityExisting;
  }),
  capacityWithAction: computed('capacityNoAction', 'newCapacityWithAction', function() {
    return this.capacityNoAction + this.newCapacityWithAction;
  }),
  capacityWithActionDelta: computed('capacityExisting', 'capacityNoAction', function() {
    return this.capacityWithAction - this.capacityExisting;
  }),
  capacityDifference: computed('capacityNoAction', 'capacityWithAction', function() {
    return this.capacityWithAction - this.capacityNoAction;
  }),
  capacityDeltaDifference: computed('capacityNoActionDelta', 'capacityWithActionDelta', function() {
    return this.capacityWithActionDelta - this.capacityNoActionDelta;
  }),


  seatsNoAction: computed('capacityNoAction', 'enrollNoAction', function() {
    return this.capacityNoAction - this.enrollNoAction;
  }),
  seatsWithAction: computed('capacityNoAction', 'enrollWithAction', function() {
    return this.capacityNoAction - this.enrollWithAction;
  }),
  seatsDifference: computed('seatsNoAction', 'seatsWithAction', function() {
    return this.seatsWithAction - this.seatsNoAction;
  }),


  utilizationNoAction: computed('enrollNoAction', function() {
    return round(this.enrollNoAction / this.capacityNoAction, 3);
  }),
  utilizationWithAction: computed('enrollWithAction', function() {
    return round(this.enrollWithAction / this.capacityNoAction, 3);
  }),
  utilizationChange: computed('utilizationWithAction', 'utilizationNoAction', function() {
    return round(this.utilizationWithAction - this.utilizationNoAction, 4);
  }),


  impact: computed('utilizationChange', 'utilizationWithAction', function() {
    return (
      (this.utilizationChange >= 0.05)
      &&
      (this.utilizationWithAction >= 1)
    );
  })
});