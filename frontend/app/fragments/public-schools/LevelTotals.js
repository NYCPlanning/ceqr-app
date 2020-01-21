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
      this.subdistrictTotals.mapBy('enrollmentTotal'),
    );
  }),

  existingConditionsCapacity: computed('subdistrictTotals', function() {
    return sumOf(
      this.subdistrictTotals.mapBy('capacityTotal'),
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
      this.subdistrictTotals.mapBy('seatsTotal'),
    );
  }),

  // No Action

  noActionEnrollment: alias('enrollNoActionTotal'),
  noActionEnrollmentDelta: alias('enrollNoActionDeltaTotal'),
  noActionCapacity: alias('capacityNoActionTotal'),
  noActionCapacityDelta: computed('subdistrictTotals', function() {
    return sumOf(
      this.subdistrictTotals.mapBy('capacityNoActionDelta'),
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
      this.subdistrictTotals.mapBy('scaCapacityIncrease'),
    );
  }),

  // Older methods

  enrollTotal: computed('subdistrictTotals', function() {
    return this.subdistrictTotals.mapBy('enroll').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  studentsTotal: computed('subdistrictTotals', function() {
    return this.subdistrictTotals.mapBy('students').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  enrollNoActionTotal: computed('enrollTotal', 'studentsTotal', function() {
    return this.enrollTotal + this.studentsTotal;
  }),

  enrollWithActionTotal: computed('subdistrictTotals', function() {
    return this.enrollNoActionTotal + this.studentsWithAction;
  }),

  enrollNoActionDeltaTotal: computed('enrollNoActionTotal', 'enrollTotal', function() {
    return this.enrollNoActionTotal - this.enrollTotal;
  }),

  enrollWithActionDeltaTotal: computed('enrollWithActionTotal', 'enrollTotal', function() {
    return this.enrollWithActionTotal - this.enrollTotal;
  }),

  enrollDifferenceTotal: computed('enrollWithActionTotal', 'enrollNoActionTotal', function() {
    return this.enrollWithActionTotal - this.enrollNoActionTotal;
  }),

  enrollDeltaDifferenceTotal: computed('enrollNoActionDeltaTotal', 'enrollWithActionDeltaTotal', function() {
    return this.enrollWithActionDeltaTotal - this.enrollNoActionDeltaTotal;
  }),

  capacityNoActionTotal: computed('subdistrictTotals', function() {
    return this.subdistrictTotals.mapBy('capacityNoAction').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  newSchoolSeats: computed('subdistrictTotals', function() {
    return this.subdistrictTotals.mapBy('newCapacityWithAction').reduce(function(acc, value) {
      return acc + parseFloat(value);
    }, 0);
  }),

  capacityWithActionTotal: computed('capacityNoActionTotal', function() {
    return this.capacityNoActionTotal + this.newSchoolSeats;
  }),

  seatsNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return this.capacityNoActionTotal - this.enrollNoActionTotal;
  }),

  seatsWithActionTotal: computed('subdistrictTotals', function() {
    return this.capacityWithActionTotal - this.enrollWithActionTotal;
  }),

  seatsDifferenceTotal: computed('seatsNoActionTotal', 'seatsWithActionTotal', function() {
    return this.seatsWithActionTotal - this.seatsNoActionTotal;
  }),

  utilizationNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return round(this.enrollNoActionTotal / this.capacityNoActionTotal, 4);
  }),

  utilizationWithActionTotal: computed('enrollWithActionTotal', 'capacityNoActionTotal', function() {
    return round(this.enrollWithActionTotal / this.capacityWithActionTotal, 4);
  }),

  utilizationChangeTotal: computed('utilizationWithActionTotal', 'utilizationNoActionTotal', function() {
    return round(this.utilizationWithActionTotal - this.utilizationNoActionTotal, 4);
  }),

  impact: computed('utilizationChangeTotal', 'utilizationWithActionTotal', function() {
    return (this.utilizationChangeTotal >= 0.05)
    && (this.utilizationWithActionTotal >= 1);
  }),

  // Mitigation
  mitigateSeatCount: computed('enrollWithActionTotal', 'utilizationNoActionTotal', 'capacityWithActionTotal', function() {
    const seatsToMitigateUtilization = this.enrollWithActionTotal - (this.capacityWithActionTotal - 1);

    const seatsToMitigateChange = Math.ceil(
      (this.enrollWithActionTotal / (this.utilizationNoActionTotal + 0.0499))
      - this.capacityWithActionTotal,
    );

    return seatsToMitigateUtilization < seatsToMitigateChange ? seatsToMitigateUtilization : seatsToMitigateChange;
  }),
  mitigateUnitCount: computed('mitigateSeatCount', function() {
    return Math.ceil(this.mitigateSeatCount / this.subdistrictTotals[0].get('studentMultiplier'));
  }),
});
