import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../../utils/round';

/**
 * The School fragment wraps a JSON object representing an school segmented by level.
 * A school building, for the purposes of public schools analysis in CEQR, represents
 * just one school level in one unique combination of bldg_id and org_id
 *
 * @constructor
 * @param {string} name - Name of school
 * @param {string} bldg_name - Building name, sometimes different from school name for multi-building schools
 * @param {string} address - Address of school
 * @param {integer} district - Building's school district
 * @param {integer} subdistrict - Building's school subdistrict
 * @param {string} org_id - DOE Organization ID of school
 * @param {string} bldg_id - DOE Building ID of school
 * @param {string} grades - Grade levels serviced. Found only in LCGMS data
 * @param {string} level - The level of the individual school. In other words, what level do the capacity and
 *   enroll numbers on this building contribute to. One of: ['ps', 'is', 'hs']
 * @param {string} org_level - The level of the organization
 * @param {string} source - The source of the data. One of: ['bluebook', 'lcgms']
 * @param {string} dataVersion - Version of LCGMS or Bluebook
 * @param {integer} capacity - School's current capacity
 * @param {integer} capacityFuture - School's future capacity, defaults to the same as capacity but a user can change this
 * @param {integer} enroll - School's current enrollment
 */
export default EmberObject.extend({
  seats: computed('excluded', 'enroll', 'capacity', function() {
    if (this.excluded) return Math.round(0 - this.enroll);
    if (!this.capacity) return 0;
    return Math.round(this.capacity - this.enroll);
  }),
  
  utilization: computed('enroll', 'capacity', function() {
    return round((this.enroll / this.capacity), 3);
  }),

  capacityDelta: computed('capacity', 'capacityFuture', function() {
    return this.capacityFuture - this.capacity;
  })
});
