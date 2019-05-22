import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import round from '../../utils/round';

export default EmberObject.extend({
  buildings: computed('allBuildings', function() {
    if (this.level === 'hs') {
      return this.allBuildings.filter((b) => b.level === 'hs');
    } else {
      return this.allBuildings.filter(
        (b) => (
          b.district === this.district &&
          b.subdistrict === this.subdistrict &&
          b.level === this.level
        )
      );
    }
  }),

  enrollmentTotal: computed('buildings.@each.enroll', function() {
    return this.buildings.mapBy('enroll').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  capacityTotal: computed('buildings.@each.capacity', function() {
    return this.buildings.map(
      (b) => b.excluded ? 0 : b.capacity
    ).reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  capacityTotalNoAction: computed('buildings.@each.capacityFuture', function() {
    return this.buildings.map(
      (b) => b.excluded ? 0 : b.capacityFuture
    ).reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  seatsTotal: computed('buildings.@each.seats', function() {
    return this.buildings.mapBy('seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  utilizationTotal: computed('enrollmentTotal', 'capacityTotal', function() {
    return round((this.enrollmentTotal / this.capacityTotal), 3);
  }),

  // Totals across all subdistricts
  enrollmentMetaTotal: computed('allBuildings', function() {
    return this.allBuildings.filterBy('level', this.level).mapBy('enroll').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  capacityMetaTotal: computed('allBuildings', function() {
    return this.allBuildings.filterBy('level', this.level).map(
      (b) => b.excluded ? 0 : b.capacity
    ).reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  seatsMetaTotal: computed('allBuildings', function() {
    return this.allBuildings.filterBy('level', this.level).mapBy('seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  utilizationMetaTotal: computed('enrollmentMetaTotal', 'capacityMetaTotal', function() {
    return round((this.enrollmentMetaTotal / this.capacityMetaTotal), 3);
  }),


  // Aggregate Totals
  enrollExistingConditions: alias('enrollmentTotal'),

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

  capacityExisting: alias('capacityTotal'),
  capacityFuture: alias('capacityTotalNoAction'),
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