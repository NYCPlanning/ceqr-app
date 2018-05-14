import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../utils/round';
import Building from '../analysis/building';

export default EmberObject.extend({  
  buildings: null,
  
  init() {
    this._super(...arguments);
    
    let buildings = (
      this.get('bluebookBuildings')
    ).concat(
      this.get('lcgmsBuildings')
    ).map(
      (b) => Building.create(b)
    );

    this.set('buildings', buildings);
  },

  enrollmentTotal: computed('buildings.@each.enroll', function() {
    return this.get('buildings').mapBy('enroll').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    });
  }),

  capacityTotal: computed('buildings.@each.capacity', function() {
    return this.get('buildings').mapBy('capacity').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    });
  }),

  seatsTotal: computed('buildings.@each.seats', function() {
    return this.get('buildings').mapBy('seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    });
  }),

  utilizationTotal: computed('enrollmentTotal', 'capacityTotal', function() {
    return round((this.get('enrollmentTotal') / this.get('capacityTotal')), 3);
  })
});