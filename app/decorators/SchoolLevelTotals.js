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

  capacityNoActionTotal: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('capacityNoAction').reduce(function(acc, value) {
      return acc + parseInt(value);
    }, 0);
  }),

  seatsNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return  this.get('capacityNoActionTotal') - this.get('enrollNoActionTotal');
  }),

  utilizationNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollNoActionTotal') / this.get('capacityNoActionTotal'), 3);
  })
});