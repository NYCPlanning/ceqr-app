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

export default class LevelTotalsFragment extends EmberObject {
  // Existing Conditions

  @computed('subdistrictTotals', function () {
    return sumOf(this.subdistrictTotals.mapBy('enrollmentTotal'));
  })
  existingConditionsEnrollment;

  @computed('subdistrictTotals', function () {
    return sumOf(this.subdistrictTotals.mapBy('capacityTotal'));
  })
  existingConditionsCapacity;

  @computed(
    'existingConditionsEnrollment',
    'existingConditionsCapacity',
    function () {
      return round(
        this.existingConditionsEnrollment / this.existingConditionsCapacity,
        4
      );
    }
  )
  existingConditionsUtilization;

  @computed('subdistrictTotals', function () {
    return sumOf(this.subdistrictTotals.mapBy('seatsTotal'));
  })
  existingConditionsSeats;

  // No Action

  @alias('enrollNoActionTotal') noActionEnrollment;
  @alias('enrollNoActionDeltaTotal') noActionEnrollmentDelta;
  @alias('capacityNoActionTotal') noActionCapacity;
  @computed('subdistrictTotals', function () {
    return sumOf(this.subdistrictTotals.mapBy('capacityNoActionDelta'));
  })
  noActionCapacityDelta;
  @alias('utilizationNoActionTotal') noActionUtilization;
  @alias('seatsNoActionTotal') noActionSeats;

  // With Action

  @alias('enrollWithActionTotal') withActionEnrollment;
  @alias('enrollWithActionDeltaTotal') withActionEnrollmentDelta;
  @alias('capacityWithActionTotal') withActionCapacity;
  @alias('newSchoolSeats') withActionCapacityDelta;
  @alias('utilizationWithActionTotal') withActionUtilization;
  @alias('seatsWithActionTotal') withActionSeats;

  // Individual Attribute Totals

  @computed('subdistrictTotals', function () {
    return sumOf(this.subdistrictTotals.mapBy('scaCapacityIncrease'));
  })
  scaCapacityIncrease;

  // Older methods

  @computed('subdistrictTotals', function () {
    return this.subdistrictTotals.mapBy('enroll').reduce(function (acc, value) {
      return acc + parseFloat(value);
    }, 0);
  })
  enrollTotal;

  @computed('subdistrictTotals', function () {
    return this.subdistrictTotals
      .mapBy('students')
      .reduce(function (acc, value) {
        return acc + parseFloat(value);
      }, 0);
  })
  studentsTotal;

  @computed('enrollTotal', 'studentsTotal', function () {
    return this.enrollTotal + this.studentsTotal;
  })
  enrollNoActionTotal;

  @computed(
    'enrollNoActionTotal',
    'studentsWithAction',
    'subdistrictTotals',
    function () {
      return this.enrollNoActionTotal + this.studentsWithAction;
    }
  )
  enrollWithActionTotal;

  @computed('enrollNoActionTotal', 'enrollTotal', function () {
    return this.enrollNoActionTotal - this.enrollTotal;
  })
  enrollNoActionDeltaTotal;

  @computed('enrollWithActionTotal', 'enrollTotal', function () {
    return this.enrollWithActionTotal - this.enrollTotal;
  })
  enrollWithActionDeltaTotal;

  @computed('enrollWithActionTotal', 'enrollNoActionTotal', function () {
    return this.enrollWithActionTotal - this.enrollNoActionTotal;
  })
  enrollDifferenceTotal;

  @computed(
    'enrollNoActionDeltaTotal',
    'enrollWithActionDeltaTotal',
    function () {
      return this.enrollWithActionDeltaTotal - this.enrollNoActionDeltaTotal;
    }
  )
  enrollDeltaDifferenceTotal;

  @computed('subdistrictTotals', function () {
    return this.subdistrictTotals
      .mapBy('capacityNoAction')
      .reduce(function (acc, value) {
        return acc + parseFloat(value);
      }, 0);
  })
  capacityNoActionTotal;

  @computed('subdistrictTotals', function () {
    return this.subdistrictTotals
      .mapBy('newCapacityWithAction')
      .reduce(function (acc, value) {
        return acc + parseFloat(value);
      }, 0);
  })
  newSchoolSeats;

  @computed('capacityNoActionTotal', 'newSchoolSeats', function () {
    return this.capacityNoActionTotal + this.newSchoolSeats;
  })
  capacityWithActionTotal;

  @computed('enrollNoActionTotal', 'capacityNoActionTotal', function () {
    return this.capacityNoActionTotal - this.enrollNoActionTotal;
  })
  seatsNoActionTotal;

  @computed(
    'capacityWithActionTotal',
    'enrollWithActionTotal',
    'subdistrictTotals',
    function () {
      return this.capacityWithActionTotal - this.enrollWithActionTotal;
    }
  )
  seatsWithActionTotal;

  @computed('seatsNoActionTotal', 'seatsWithActionTotal', function () {
    return this.seatsWithActionTotal - this.seatsNoActionTotal;
  })
  seatsDifferenceTotal;

  @computed('enrollNoActionTotal', 'capacityNoActionTotal', function () {
    return round(this.enrollNoActionTotal / this.capacityNoActionTotal, 4);
  })
  utilizationNoActionTotal;

  @computed(
    'capacityNoActionTotal',
    'capacityWithActionTotal',
    'enrollWithActionTotal',
    function () {
      return round(
        this.enrollWithActionTotal / this.capacityWithActionTotal,
        4
      );
    }
  )
  utilizationWithActionTotal;

  @computed(
    'utilizationWithActionTotal',
    'utilizationNoActionTotal',
    function () {
      return round(
        this.utilizationWithActionTotal - this.utilizationNoActionTotal,
        4
      );
    }
  )
  utilizationChangeTotal;

  @computed(
    'utilizationChangeTotal',
    'utilizationWithActionTotal',
    function () {
      return (
        this.utilizationChangeTotal >= 0.05 &&
        this.utilizationWithActionTotal >= 1
      );
    }
  )
  impact;

  // Mitigation
  @computed(
    'enrollWithActionTotal',
    'utilizationNoActionTotal',
    'capacityWithActionTotal',
    function () {
      const seatsToMitigateUtilization =
        this.enrollWithActionTotal - (this.capacityWithActionTotal - 1);

      const seatsToMitigateChange = Math.ceil(
        this.enrollWithActionTotal / (this.utilizationNoActionTotal + 0.0499) -
          this.capacityWithActionTotal
      );

      return seatsToMitigateUtilization < seatsToMitigateChange
        ? seatsToMitigateUtilization
        : seatsToMitigateChange;
    }
  )
  mitigateSeatCount;
  @computed('mitigateSeatCount', 'subdistrictTotals', function () {
    return Math.ceil(
      this.mitigateSeatCount /
        this.subdistrictTotals[0].get('studentMultiplier')
    );
  })
  mitigateUnitCount;
}
