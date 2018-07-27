import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({
  buildings: computed('allBuildings', function() {
    if (this.get('level') === 'hs') {
      return this.get('allBuildings').filter((b) => b.level === 'hs');
    } else {
      return this.get('allBuildings').filter(
        (b) => (
          b.district === this.get('district') &&
          b.subdistrict === this.get('subdistrict') &&
          b.level === this.get('level')
        )
      );
    }
  }),

  enrollmentTotal: computed('buildings.@each.enroll', function() {
    return this.get('buildings').mapBy('enroll').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  capacityTotal: computed('buildings.@each.capacity', function() {
    return this.get('buildings').map(
      (b) => b.excluded ? 0 : b.capacity
    ).reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  capacityTotalNoAction: computed('buildings.@each.capacityFuture', function() {
    return this.get('buildings').mapBy('capacityFuture').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  seatsTotal: computed('buildings.@each.seats', function() {
    return this.get('buildings').mapBy('seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  utilizationTotal: computed('enrollmentTotal', 'capacityTotal', function() {
    return round((this.get('enrollmentTotal') / this.get('capacityTotal')), 3);
  }),

  // Totals across all subdistricts
  enrollmentMetaTotal: computed('allBuildings', function() {
    return this.get('allBuildings').filterBy('level', this.get('level')).mapBy('enroll').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  capacityMetaTotal: computed('allBuildings', function() {
    return this.get('allBuildings').filterBy('level', this.get('level')).map(
      (b) => b.excluded ? 0 : b.capacity
    ).reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  seatsMetaTotal: computed('allBuildings', function() {
    return this.get('allBuildings').filterBy('level', this.get('level')).mapBy('seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  utilizationMetaTotal: computed('enrollmentMetaTotal', 'capacityMetaTotal', function() {
    return round((this.get('enrollmentMetaTotal') / this.get('capacityMetaTotal')), 3);
  }),
});