import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';

export default EmberObject.extend({
  enrollTotal: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('enroll').reduce(function(acc, value) {            
      return acc + parseInt(value);
    }, 0);
  }),

  studentsTotal: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('students').reduce(function(acc, value) {            
      return acc + parseInt(value);
    }, 0);
  }),

  enrollNoActionTotal: computed('projectedEnrollTotal', 'studentsTotal', function() {
    return this.get('enrollTotal') + this.get('studentsTotal');
  }),

  enrollWithActionTotal: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('enrollWithAction').reduce(function(acc, value) {            
      return acc + parseInt(value);
    }, 0);
  }),

  capacityNoActionTotal: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('capacityNoAction').reduce(function(acc, value) {
      return acc + parseInt(value);
    }, 0);
  }),

  seatsNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return  this.get('capacityNoActionTotal') - this.get('enrollNoActionTotal');
  }),

  seatsWithActionTotal: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('seatsWithAction').reduce(function(acc, value) {            
      return acc + parseInt(value);
    }, 0);
  }),

  utilizationNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollNoActionTotal') / this.get('capacityNoActionTotal'), 3);
  }),

  utilizationWithActionTotal: computed('enrollWithActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollWithActionTotal') / this.get('capacityNoActionTotal'), 3);
  }),

  utilizationChangeTotal: computed('utilizationWithActionTotal', 'utilizationNoActionTotal', function() {
    return round(this.get('utilizationWithActionTotal') - this.get('utilizationNoActionTotal'), 4);
  }),

  impact: computed('utilizationChangeTotal', 'utilizationWithActionTotal', function() {
    return (
      (this.get('utilizationChangeTotal') >= 0.05)
      &&
      (this.get('utilizationWithActionTotal') >= 1)
    );
  })
});