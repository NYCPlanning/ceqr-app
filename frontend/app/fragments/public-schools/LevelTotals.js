import EmberObject, { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import round from '../../utils/round';
import sumOf from '../../utils/sumMapBy';

/**
 * LevelTotals is an EmberObject that aggregates the output of a list of SubdistrictTotals
 * Three LevelTotals obejcts are created per analysis, one for each school level: ps, is, hs.
 *
 * @constructor
 * @param {SubdistrictTotal[]} subdistrictTotals - Array of SubdistrictTotal objects filtered by relevant level
 * @param {integer} studentsWithAction - Number of students to be added by project under analysis
 */

export default EmberObject.extend({
  // Existing Conditions

  existingConditionsEnrollment: computed('subdistrictTotals', function() {
    return sumOf(
      this.get('subdistrictTotals').mapBy('enrollmentTotal'),
    );
  }),

  existingConditionsCapacity: computed('subdistrictTotals', function() {
    return sumOf(
      this.get('subdistrictTotals').mapBy('capacityTotal'),
    );
  }),

  existingConditionsUtilization: computed(
    'existingConditionsEnrollment',
    'existingConditionsCapacity',
    function() {
      return round(this.existingConditionsEnrollment / this.existingConditionsCapacity, 4);
    },
  ),

  existingConditionsSeats: computed('subdistrictTotals', function() {
    return sumOf(
      this.get('subdistrictTotals').mapBy('seatsTotal'),
    );
  }),

  // No Action

  noActionEnrollment: alias('enrollNoActionTotal'),
  noActionEnrollmentDelta: alias('enrollNoActionDeltaTotal'),
  noActionCapacity: alias('capacityNoActionTotal'),
  noActionCapacityDelta: computed('subdistrictTotals', function() {
    return sumOf(
      this.get('subdistrictTotals').mapBy('capacityNoActionDelta'),
    );
  }),
  noActionUtilization: alias('utilizationNoActionTotal'),
  noActionSeats: alias('seatsNoActionTotal'),

  // With Action

  withActionEnrollment: alias('enrollWithActionTotal'),
  withActionEnrollmentDelta: alias('enrollWithActionDeltaTotal'),
  withActionCapacity: alias('capacityWithActionTotal'),
  withActionCapacityDelta: alias('newSchoolSeats'),
  withActionUtilization: alias('utilizationWithActionTotal'),
  withActionSeats: alias('seatsWithActionTotal'),

  // Individual Attribute Totals

  scaCapacityIncrease: computed('subdistrictTotals', function() {
    return sumOf(
      this.get('subdistrictTotals').mapBy('scaCapacityIncrease'),
    );
  }),

  // Older methods

  enrollTotal: computed('subdistrictTotals', function() {
    return this.get('subdistrictTotals').mapBy('enroll').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  studentsTotal: computed('subdistrictTotals', function() {
    return this.get('subdistrictTotals').mapBy('students').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  enrollNoActionTotal: computed('enrollTotal', 'studentsTotal', function() {
    return this.get('enrollTotal') + this.get('studentsTotal');
  }),

  enrollWithActionTotal: computed('subdistrictTotals', function() {
    return this.get('enrollNoActionTotal') + this.studentsWithAction;
  }),

  enrollNoActionDeltaTotal: computed('enrollNoActionTotal', 'enrollTotal', function() {
    return this.get('enrollNoActionTotal') - this.get('enrollTotal');
  }),

  enrollWithActionDeltaTotal: computed('enrollWithActionTotal', 'enrollTotal', function() {
    return this.get('enrollWithActionTotal') - this.get('enrollTotal');
  }),

  enrollDifferenceTotal: computed('enrollWithActionTotal', 'enrollNoActionTotal', function() {
    return this.get('enrollWithActionTotal') - this.get('enrollNoActionTotal');
  }),

  enrollDeltaDifferenceTotal: computed('enrollNoActionDeltaTotal', 'enrollWithActionDeltaTotal', function() {
    return this.get('enrollWithActionDeltaTotal') - this.get('enrollNoActionDeltaTotal');
  }),

  capacityNoActionTotal: computed('subdistrictTotals', function() {
    return this.get('subdistrictTotals').mapBy('capacityNoAction').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  newSchoolSeats: computed('subdistrictTotals', function() {
    return this.get('subdistrictTotals').mapBy('newCapacityWithAction').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  capacityWithActionTotal: computed('capacityNoActionTotal', function() {
    return this.get('capacityNoActionTotal') + this.get('newSchoolSeats');
  }),

  seatsNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return this.get('capacityNoActionTotal') - this.get('enrollNoActionTotal');
  }),

  seatsWithActionTotal: computed('subdistrictTotals', function() {
    return this.get('capacityWithActionTotal') - this.get('enrollWithActionTotal');
  }),

  seatsDifferenceTotal: computed('seatsNoActionTotal', 'seatsWithActionTotal', function() {
    return this.get('seatsWithActionTotal') - this.get('seatsNoActionTotal');
  }),

  utilizationNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollNoActionTotal') / this.get('capacityNoActionTotal'), 4);
  }),

  utilizationWithActionTotal: computed('enrollWithActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollWithActionTotal') / this.get('capacityWithActionTotal'), 4);
  }),

  utilizationChangeTotal: computed('utilizationWithActionTotal', 'utilizationNoActionTotal', function() {
    return round(this.get('utilizationWithActionTotal') - this.get('utilizationNoActionTotal'), 4);
  }),

  impact: computed('utilizationChangeTotal', 'utilizationWithActionTotal', function() {
    return (
      (this.get('utilizationChangeTotal') >= 0.05)
      && (this.get('utilizationWithActionTotal') >= 1)
    );
  }),

  // Mitigation
  mitigateSeatCount: computed('enrollWithActionTotal', 'utilizationNoActionTotal', 'capacityWithActionTotal', function() {
    const seatsToMitigateUtilization = this.get('enrollWithActionTotal') - (this.get('capacityWithActionTotal') - 1);

    const seatsToMitigateChange = Math.ceil(
      (this.get('enrollWithActionTotal') / (this.get('utilizationNoActionTotal') + 0.0499))
      - this.get('capacityWithActionTotal'),
    );

    return seatsToMitigateUtilization < seatsToMitigateChange ? seatsToMitigateUtilization : seatsToMitigateChange;
  }),
  mitigateUnitCount: computed('mitigateSeatCount', function() {
    return Math.ceil(this.get('mitigateSeatCount') / this.get('subdistrictTotals')[0].get('studentMultiplier'));
  }),
});
