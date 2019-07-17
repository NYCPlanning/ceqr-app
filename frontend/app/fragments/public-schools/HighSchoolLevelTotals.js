import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import round from '../../utils/round';

/**
 * SubdistrictTotals is an EmberObject that runs the fundamental calculations of a public schools analysis.
 * It accepts a number attributes that come from the database, stored on the public-schools-analysis model.
 * A SubdistrictTotals object is created for every ps and is school, per subdistrict. And one SubdistrictTotals
 * for the borough wide hs analysis. (@todo a different object should probably exist specifically for hs analysis)
 *
 * @constructors
 * @param {string} level - ps, is, or hs
 *
 * @param {string} borough - Borough if level is hs
 * @param {integer} district - School district if level is ps or is
 * @param {integer} subdistrict - School subdistrict if level is ps or is
 *
 * @param {School[]} allBuildings - Array of all Schools received from the db
 *
 * @param {integer} studentMultiplier - Multiplier for the given level
 * @param {integer} enroll - Future enrollment for given level, subdistrict, and build year
 * @param {integer} students - Future students from sca enrollment projections and any user-inputed future housing development
 * @param {integer} scaCapacityIncrease - Additional school seats provided by future schools (from sca capital plan) user has included in analysis
 * @param {integer} newCapacityWithAction - Additional school seats provided by school built with project
 *
 * @todo rename `buildings` attribut to `schools`
 * @todo experiment with typescript for calculation fragments
 */

/* VARIABLES DEFINED in HighSchoolLevelTotals (all of these variables are also defined in LevelTotals, but are calculated differently)

      //// EXISTING CONDITIONS ////////////////
      * existingConditionsEnrollment {array of objects} -> aggregate of enrollin all schools 
      * existingConditionsCapacity {integer} -> aggregate of capacity in all schools where exluded is false
      * existingConditionsUtilization {number} -> existingConditionsEnrollment / existingConditionsCapacity
      * existingConditionsSeats {integer} -> aggregate of seats in all schools

      //// ENROLL ////////////////////////////
      * studentsTotal {integer} -> hsStudentsFromHousing + (aggregate of hs_students in futureResidentialDev)
      * enrollNoActionTotal {integer} -> existingConditionsEnrollment + studentsTotal
      * enrollWithActionTotal {number} -> enrollNoActionTotal + studentsWithAction
      * enrollNoActionDeltaTotal {integer} -> enrollNoActionTotal - existingConditionsEnrollment
      * enrollWithActionDeltaTotal {integer} -> enrollWithActionTotal - existingConditionsEnrollment
      * enrollDifferenceTotal {integer} -> enrollWithActionTotal - enrollNoActionTotal
      * enrollDeltaDifference {integer} -> enrollWithActionDeltaTotal - enrollNoActionDeltaTotal

      //// CAPACITY ////////////////////////////
      * hsCapacityFuture {integer} -> aggregate of capacityFuture in all schools  * NOT in LevelTotals *
      * capacityNoActionTotal {integer} -> hsCapacityFuture + scaCapacityIncreaseHighSchools
      * newSchoolSeats {integer} -> aggregate of hs_seats in all schoolsWithAction
      * capacityWithActionTotal {integer} -> capacityNoActionTotal + newSchoolSeats
      * noActionCapacityDelta {integer} -> capacityNoActionTotal - existingConditionsCapacity

      //// SEATS ////////////////////////////
      * seatsNoActionTotal {integer} -> capacityNoActionTotal - enrollNoActionTotal
      * seatsWithActionTotal {integer} -> capacityWithActionTotal - enrollWithActionTotal
      * seatsDifferenceTotal {integer} -> seatsWithActionTotal - seatsNoActionTotal

      //// UTILIZATION ////////////////////////////
      * utilizationNoActionTotal {number} -> enrollNoActionTotal / capacityNoActionTotal
      * utilizationWithActionTotal {number} -> enrollWithActionTotal / capacityWithActionTotal
      * utilizationChangeTotal {number} -> utilizationWithActionTotal - utilizationNoActionTotal

      //// IMPACT ////////////////////////////
      * impact {boolean} -> utilizationChangeTotal >= 0.5 && utilizationWithActionTotal >= 1
*/

export default EmberObject.extend({
  buildings: computed('allBuildings', function() {
    if (this.level === 'hs') {
      return this.allBuildings.filter((b) => b.level === 'hs');
    }
  }),

  // 365 Question: how does this work if multipliers are dependent on subdistrict??
  // studentMultiplier: computed('currentMultiplier', function() {
  //   return this.currentMultiplier
  // }),

  /////////// EXISTING CONDITIONS ///////////////////////////////////////////////////////////////////////////////////////////////////

  // #existingConditionsEnrollment
  existingConditionsEnrollment: computed('buildings.@each.enroll', function() {
    return this.buildings.mapBy('enroll').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  // #existingConditionsCapacity
  existingConditionsCapacity: computed('buildings.@each.capacity', function() {
    return this.buildings.map(
      (b) => b.excluded ? 0 : b.capacity
    ).reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  // #existingConditionsUtilization
  existingConditionsUtilization: computed(
    'existingConditionsEnrollment',
    'existingConditionsCapacity',
    function() {
      return round(this.existingConditionsEnrollment / this.existingConditionsCapacity, 4);
    }
  ),

  // #existingConditionsSeats
  existingConditionsSeats: computed('buildings.@each.seats', function() {
    return this.buildings.mapBy('seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),


  /////////// ENROLL ///////////////////////////////////////////////////////////////////////////////////////////////////

  // #studentsTotal
  studentsTotal: computed('hsStudentsFromHousing', 'futureResidentialDev', function() {
    const residential_dev_hs_students = this.futureResidentialDev.reduce(function(acc, value) {return acc + value.hs_students;}, 0)
    return this.hsStudentsFromHousing + residential_dev_hs_students;
  }),

  // #enrollNoActionTotal
  // 365 Question: replaced `enrollTotal` with `existingConditionsEnrollment`
  enrollNoActionTotal: computed('existingConditionsEnrollment', 'studentsTotal', function() {
    return this.get('existingConditionsEnrollment') + this.get('studentsTotal');
  }),

  // #enrollWithActionTotal
  enrollWithActionTotal: computed('enrollNoActionTotal', 'enrollTotal', function() {    
    return this.get('enrollNoActionTotal') + this.studentsWithAction;
  }),

  // #enrollNoActionDeltaTotal
  // 365 Question: replaced `enrollTotal` with `existingConditionsEnrollment`
  enrollNoActionDeltaTotal: computed('enrollNoActionTotal', 'existingConditionsEnrollment', function() {
    return this.get('enrollNoActionTotal') - this.get('existingConditionsEnrollment');
  }),

  // #enrollWithActionDeltaTotal
  // 365 Question: replaced `enrollTotal` with `existingConditionsEnrollment` 
  enrollWithActionDeltaTotal: computed('enrollWithActionTotal', 'existingConditionsEnrollment', function() {
    return this.get('enrollWithActionTotal') - this.get('existingConditionsEnrollment');
  }),

  // #enrollDifferenceTotal
  enrollDifferenceTotal: computed('enrollWithActionTotal', 'enrollNoActionTotal', function() {
    return this.get('enrollWithActionTotal') - this.get('enrollNoActionTotal');
  }),

  // #enrollDeltaDifferenceTotal
  enrollDeltaDifferenceTotal: computed('enrollNoActionDeltaTotal', 'enrollWithActionDeltaTotal', function() {
    return this.get('enrollWithActionDeltaTotal') - this.get('enrollNoActionDeltaTotal');
  }),

/////////// CAPACITY ///////////////////////////////////////////////////////////////////////////////////////////////////

  // #hsCapacityFuture
  hsCapacityFuture: computed('buildings.@each.capacityFuture', function() {
    return this.buildings.mapBy('capacityFuture').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  // #capacityNoActionTotal
  // scaCapacityIncrease is defined in public-schools-analysis model
  capacityNoActionTotal: computed('hsCapacityFuture', 'scaCapacityIncreaseHighSchools', function() {
    return this.hsCapacityFuture + this.scaCapacityIncreaseHighSchools;
  }),

  // #noActionCapacityDelta
  noActionCapacityDelta: computed('capacityExisting', 'capacityNoAction', function() {
    return this.capacityNoActionTotal - this.existingConditionsCapacity;
  }),

   // newCapacityWithAction --> newSchoolSeats
  newSchoolSeats: computed('schoolsWithAction.@each.hs_seats', function() {
    return this.schoolsWithAction.mapBy('hs_seats').reduce((acc, value) => {
      if (value === undefined) return acc;
      return acc + parseInt(value);
    }, 0);
  }),

  // #capacityWithActionTotal
  capacityWithActionTotal: computed('capacityNoActionTotal', function() {
    return this.get('capacityNoActionTotal') + this.get('newSchoolSeats');
  }),

  /////////// SEATS ///////////////////////////////////////////////////////////////////////////////////////////////////

  // #seatsNoActionTotal
  seatsNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return this.get('capacityNoActionTotal') - this.get('enrollNoActionTotal');
  }),

  // #seatsWithActionTotal
  seatsWithActionTotal: computed('subdistrictTotals', function() {
    return this.get('capacityWithActionTotal') - this.get('enrollWithActionTotal');
  }),

  // #seatsDifferenceTotal
  seatsDifferenceTotal: computed('seatsNoActionTotal', 'seatsWithActionTotal', function() {
    return this.get('seatsWithActionTotal') - this.get('seatsNoActionTotal');
  }),

  /////////// UTILIZATION ///////////////////////////////////////////////////////////////////////////////////////////////////

  // #utilizationNoActionTotal
  utilizationNoActionTotal: computed('enrollNoActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollNoActionTotal') / this.get('capacityNoActionTotal'), 4);
  }),

  // #utilizationWithActionTotal
  utilizationWithActionTotal: computed('enrollWithActionTotal', 'capacityNoActionTotal', function() {
    return round(this.get('enrollWithActionTotal') / this.get('capacityWithActionTotal'), 4);
  }),

  // #utilizationChangeTotal
  utilizationChangeTotal: computed('utilizationWithActionTotal', 'utilizationNoActionTotal', function() {
    return round(this.get('utilizationWithActionTotal') - this.get('utilizationNoActionTotal'), 4);
  }),

  /////////// IMPACT ///////////////////////////////////////////////////////////////////////////////////////////////////

  // #impact
  impact: computed('utilizationChangeTotal', 'utilizationWithActionTotal', function() {
    return (
      (this.get('utilizationChangeTotal') >= 0.05)
      &&
      (this.get('utilizationWithActionTotal') >= 1)
    );
  }),

});
