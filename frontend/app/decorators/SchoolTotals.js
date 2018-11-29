import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

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
});