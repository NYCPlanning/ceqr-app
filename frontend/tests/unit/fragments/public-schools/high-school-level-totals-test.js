import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import HighSchoolLevelTotals from 'labs-ceqr/fragments/public-schools/HighSchoolLevelTotals';
import School from 'labs-ceqr/fragments/public-schools/School';

module('Unit | Fragment | HighSchoolLevelTotals', function(hooks) {
  setupTest(hooks);

  // buildings
  test('#buildings returns correct filters list', function(assert) {
    let schools =  [
      School.create({
        level: 'hs',
        enroll: 300
      }),
    ];

    let hs_schools = HighSchoolLevelTotals.create({
      allBuildings: schools,
      level: 'hs',
    });

    assert.deepEqual(hs_schools.buildings, [
      School.create({
        level: 'hs',
        enroll: 300
      })
    ]);
  });

  // existingConditionsEnrollment
  test('#existingConditionsEnrollment returns correct value', function(assert) {
    let schools =  [
      School.create({
        level: 'hs',
        enroll: 300
      }),
      School.create({
        level: 'hs',
        enroll: 200
      }),
    ];

    let hs_level_totals = HighSchoolLevelTotals.create({
      allBuildings: schools,
      level: 'hs',
    });

    assert.equal(hs_level_totals.existingConditionsEnrollment, 500); // enroll aggregated across all schools
  });

  // existingConditionsCapacity
  test('#existingConditionsCapacity returns correct value', function(assert) {
    let schools =  [
      School.create({
        level: 'hs',
        capacity: 100,
        excluded: false
      }),
      School.create({
        level: 'hs',
        capacity: 250,
        excluded: false
      }),
      School.create({
        level: 'hs',
        capacity: 100,
        excluded: true
      }),
    ];

    let hs_level_totals = HighSchoolLevelTotals.create({
      allBuildings: schools,
      level: 'hs',
    });

    assert.equal(hs_level_totals.existingConditionsCapacity, 350); // aggregated capacity across all schools if exluded = false 
  });

  // existingConditionsUtilization
  test('#existingConditionsUtilization returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      existingConditionsCapacity: 400,
      existingConditionsEnrollment: 100
    })

    assert.equal(hs_level_totals.existingConditionsUtilization, 0.25); // existingConditionsEnrollment/existingConditionsCapacity
  });

  // existingConditionsSeats
  test('#existingConditionsSeats returns correct value', function(assert) {
    let schools =  [
      School.create({
        level: 'hs',
        seats: 100,
      }),
      School.create({
        level: 'hs',
        seats: 200,
      }),
    ];

    let hs_level_totals = HighSchoolLevelTotals.create({
      allBuildings: schools,
      level: 'hs',
    });

    assert.equal(hs_level_totals.existingConditionsSeats, 300); // seats aggregated across all schools
  });

  // studentsTotal
  test('#studentsTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      hsStudentsFromHousing: 1000,
      futureResidentialDev: [
        {
          name: 'Hamster Heaven',
          hs_students: 100
        },
        {
          name: 'Pig Palace',
          hs_students: 200
      },
    ],
  });

    assert.equal(hs_level_totals.studentsTotal, 1300); // hsStudentsFromHousing + (aggregate of hs_seats in futureResidentialDev) 
  });

  // enrollNoActionTotal
  test('#enrollNoActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      existingConditionsEnrollment: 600,
      studentsTotal: 500
  });

    assert.equal(hs_level_totals.enrollNoActionTotal, 1100); // existingConditionsEnrollment + studentsTotal 
  });

  // enrollWithActionTotal
  test('#enrollWithActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      enrollNoActionTotal: 150,
      studentsWithAction: 100
  });

    assert.equal(hs_level_totals.enrollWithActionTotal, 250); // enrollNoActionTotal + studentsWithAction
  });


  // enrollNoActionDeltaTotal
  test('#enrollNoActionDeltaTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      existingConditionsEnrollment: 100,
      enrollNoActionTotal: 300
  });

    assert.equal(hs_level_totals.enrollNoActionDeltaTotal, 200); // enrollNoActionTotal - existingConditionsEnrollment
  });

  // enrollWithActionDeltaTotal
  test('#enrollWithActionDeltaTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      existingConditionsEnrollment: 250,
      enrollWithActionTotal: 400
  });

    assert.equal(hs_level_totals.enrollWithActionDeltaTotal, 150); // enrollWithActionTotal - existingConditionsEnrollment
  });

  // enrollDifferenceTotal
  test('#enrollDifferenceTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      enrollNoActionTotal: 400,
      enrollWithActionTotal: 600
  });

    assert.equal(hs_level_totals.enrollDifferenceTotal, 200); // enrollWithActionTotal - enrollNoActionTotal
  });

  // enrollDeltaDifferenceTotal
  test('#enrollDeltaDifferenceTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      enrollNoActionDeltaTotal: 100,
      enrollWithActionDeltaTotal: 350
  });

    assert.equal(hs_level_totals.enrollDeltaDifferenceTotal, 250); // enrollWithActionDeltaTotal - enrollNoActionDeltaTotal
  });

  // hsCapacityFuture
   test('#hsCapacityFuture returns correct value', function(assert) {
    let schools =  [
      School.create({
        level: 'hs',
        capacityFuture: 200
      }),
      School.create({
        level: 'hs',
        capacityFuture: 150
      }),
    ];

    let hs_level_totals = HighSchoolLevelTotals.create({
      allBuildings: schools,
      level: 'hs',
    });

    assert.equal(hs_level_totals.hsCapacityFuture, 350); // capacityFuture aggregate across all schools
  });

  // capacityNoActionTotal
  test('#capacityNoActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      scaCapacityIncreaseHighSchools: 300,
      hsCapacityFuture: 100
    });

    assert.equal(hs_level_totals.capacityNoActionTotal, 400); // scaCapacityIncreaseHighSchools + hsCapacityFuture
  });

  // noActionCapacityDelta
  test('#noActionCapacityDelta returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      existingConditionsCapacity: 150,
      capacityNoActionTotal: 300
    });

    assert.equal(hs_level_totals.noActionCapacityDelta, 150); // capacityNoActionTotal - existingConditionsCapacity
  });

  // newSchoolSeats
  test('#newSchoolSeats returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      schoolsWithAction: [
        {
          name: "Watermelon Waterfall",
          hs_seats: 100
        },
        {
          name: "Lemon Luxury",
          hs_seats: 150
        },
      ]
    });

    assert.equal(hs_level_totals.newSchoolSeats, 250); // aggregate of hs_seats in schoolsWithAction
  });

  // seatsNoActionTotal
  test('#seatsNoActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      capacityNoActionTotal: 200,
      enrollNoActionTotal: 100 
    });

    assert.equal(hs_level_totals.seatsNoActionTotal, 100); // capacityNoActionTotal - enrollNoActionTotal
  });

  // seatsWithActionTotal
  test('#seatsWithActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      capacityWithActionTotal: 300,
      enrollWithActionTotal: 150 
    });

    assert.equal(hs_level_totals.seatsWithActionTotal, 150); // capacityNoActionTotal - enrollNoActionTotal
  });

  // seatsDifferenceTotal
  test('#seatsDifferenceTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      seatsWithActionTotal: 400,
      seatsNoActionTotal: 350 
    });

    assert.equal(hs_level_totals.seatsDifferenceTotal, 50); // capacityNoActionTotal - enrollNoActionTotal
  });


  // utilizationNoActionTotal
  test('#utilizationNoActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      enrollNoActionTotal: 173,
      capacityNoActionTotal: 273 
    });

    assert.equal(hs_level_totals.utilizationNoActionTotal, 0.6337); // utilizationWithActionTotal - utilizationNoActionTotal
  });

  // seatsWithActionTotal
  test('#utilizationWithActionTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      enrollWithActionTotal: 100,
      capacityWithActionTotal: 300 
    });

    assert.equal(hs_level_totals.utilizationWithActionTotal, 0.3333); // enrollWithActionTotal - capacityWithActionTotal
  });

  // utilizationChangeTotal
  test('#utilizationChangeTotal returns correct value', function(assert) {
    let hs_level_totals = HighSchoolLevelTotals.create({
      level: 'hs',
      utilizationWithActionTotal: 500,
      utilizationNoActionTotal: 350 
    });

    assert.equal(hs_level_totals.utilizationChangeTotal, 150); // utilizationWithActionTotal - utilizationNoActionTotal
  });

  // impact utilizationChangeTotal YES utilizationwithActionTotal NO
  test('#impact returns correct value', function(assert) {
    let hs_level_totals_Change_true_withAction_false = HighSchoolLevelTotals.create({
      level: 'hs',
      utilizationChangeTotal: 0.05,
      utilizationWithActionTotal: 0.9 
    });

    let hs_level_totals_Change_false_withAction_true = HighSchoolLevelTotals.create({
      level: 'hs',
      utilizationChangeTotal: 0.04,
      utilizationWithActionTotal: 1 
    });

    let hs_level_totals_Change_false_withAction_false = HighSchoolLevelTotals.create({
      level: 'hs',
      utilizationChangeTotal: 0.04,
      utilizationWithActionTotal: 0.9 
    });

    let hs_level_totals_Change_true_withAction_true = HighSchoolLevelTotals.create({
      level: 'hs',
      utilizationChangeTotal: 0.05,
      utilizationWithActionTotal: 1 
    });

    assert.equal(hs_level_totals_Change_true_withAction_false.impact, false); // utilizationChangeTotal >= 0.05 && utilizationWithActionTotal >= 1
    assert.equal(hs_level_totals_Change_false_withAction_true.impact, false); // utilizationChangeTotal >= 0.05 && utilizationWithActionTotal >= 1
    assert.equal(hs_level_totals_Change_false_withAction_false.impact, false); // utilizationChangeTotal >= 0.05 && utilizationWithActionTotal >= 1
    assert.equal(hs_level_totals_Change_true_withAction_true.impact, true); // utilizationChangeTotal >= 0.05 && utilizationWithActionTotal >= 1
  });



});
