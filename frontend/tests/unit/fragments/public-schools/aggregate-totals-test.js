import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import AggregateTotals from 'labs-ceqr/fragments/public-schools/AggregateTotals';
import School from 'labs-ceqr/fragments/public-schools/School';

module('Unit | Fragment | AggregateTotals', function(hooks) {
  setupTest(hooks);
  
  test('#buildings returns correct filters list', function(assert) {
    let buildings =  [
      School.create({
        level: 'hs',
        district: 1,
        subdistrict: 2
      }),
      School.create({
        level: 'ps',
        district: 1,
        subdistrict: 2
      }),
      School.create({
        level: 'ps',
        district: 1,
        subdistrict: 3
      }),
      School.create({
        level: 'is',
        district: 1,
        subdistrict: 2
      }),
    ];

    let hs_school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.deepEqual(hs_school_totals.buildings, [
      School.create({
        level: 'hs',
        district: 1,
        subdistrict: 2
      })
    ]);

    let ps_school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'ps',
      district: 1,
      subdistrict: 2
    });

    assert.deepEqual(ps_school_totals.buildings, [
      School.create({
        level: 'ps',
        district: 1,
        subdistrict: 2
      })
    ]);
  });

  test('#enrollmentTotal returns correct calculation', function(assert) {
    let buildings = [
      School.create({
        level: 'hs',
        enroll: 125
      }),
      School.create({
        level: 'hs',
        enroll: 100
      })
    ];

    let school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.equal(school_totals.enrollmentTotal, 225);

  });

test('#capacityTotal returns correct calculation', function(assert) {
  let buildings = [
    School.create({
      level: 'hs',
      capacity: 140
    }),
    School.create({
      level: 'hs',
      capacity: 130
    }),
    School.create({
      level: 'hs',
      capacity: 400,
      excluded: true
    })
  ];

  let school_totals = AggregateTotals.create({
    allBuildings: buildings,
    level: 'hs'
  });

  assert.equal(school_totals.capacityTotal, 270);

  });

  test('#capacityTotalNoAction returns correct calculation', function(assert) {
    let buildings = [
      School.create({
        level: 'hs',
        capacityFuture: 160
      }),
      School.create({
        level: 'hs',
        capacityFuture: 145
      }),
      School.create({
        level: 'hs',
        capacityFuture: 300,
        excluded: true
      }),
    ];

    let school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.equal(school_totals.capacityTotalNoAction, 305);

  });

  test('#seatsTotal returns correct calculation', function(assert) {
    let buildings = [
      School.create({
        level: 'hs',
        seats: 160
      }),
      School.create({
        level: 'hs',
        seats: 145
      })
    ];

    let school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.equal(school_totals.seatsTotal, 305);

  });

  test('#utilizationTotal returns correct calculation', function(assert) {
    let school_totals = AggregateTotals.create({
      level: 'hs',
      enrollmentTotal: 102,
      capacityTotal:  177
    });

    assert.equal(school_totals.utilizationTotal, 0.576);

  });

  test('#enrollmentMetaTotal returns correct calculation', function(assert) {
    let buildings = [
      School.create({
        level: 'hs',
        enroll: 160
      }),
      School.create({
        level: 'hs',
        enroll: 170
      }),
      School.create({
        level: 'ps',
        enroll: 145
      }),
      School.create({
        level: 'ps',
        enroll: 140
      })
    ];

    let school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'ps'
    });

    assert.equal(school_totals.enrollmentMetaTotal, 285);

  });

  test('#capacityMetaTotal returns correct calculation', function(assert) {
    let buildings = [
      School.create({
        level: 'hs',
        capacity: 160
      }),
      School.create({
        level: 'hs',
        capacity: 170
      }),
      School.create({
        level: 'ps',
        capacity: 145
      }),
      School.create({
        level: 'ps',
        capacity: 140
      }),
      School.create({
        level: 'ps',
        capacity: 200,
        excluded: true
      })
    ];

    let school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'ps'
    });

    assert.equal(school_totals.capacityMetaTotal, 285);

  });

  test('#seatsMetaTotal returns correct calculation', function(assert) {
    let buildings = [
      School.create({
        level: 'hs',
        seats: 160
      }),
      School.create({
        level: 'hs',
        seats: 170
      }),
      School.create({
        level: 'ps',
        seats: 145
      }),
      School.create({
        level: 'ps',
        seats: 140
      })
    ];

    let school_totals = AggregateTotals.create({
      allBuildings: buildings,
      level: 'ps'
    });

    assert.equal(school_totals.seatsMetaTotal, 285);

  });

  test('#utilizationMetaTotal returns correct calculation', function(assert) {
    let school_totals = AggregateTotals.create({
      level: 'hs',
      enrollmentMetaTotal: 131,
      capacityMetaTotal:  145
    });

    assert.equal(school_totals.utilizationMetaTotal, 0.903);

  });

  test('#enrollNoAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enroll: 300,
      students: 400
    });

    assert.equal(aggregate_totals.enrollNoAction, 700);

  });

  test('#enrollNoActionDelta is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollNoAction: 400,
      enrollExistingConditions: 200
    });

    assert.equal(aggregate_totals.enrollNoActionDelta, 200);

  });

  test('#enrollWithAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollNoAction: 400,
      studentsWithAction: 200
    });

    assert.equal(aggregate_totals.enrollWithAction, 600);

  });

  test('#enrollWithActionDelta is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollWithAction: 400,
      enrollExistingConditions: 200
    });

    assert.equal(aggregate_totals.enrollWithActionDelta, 200);

  });

  test('#enrollDifference is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollWithAction: 400,
      enrollNoAction: 200
    });

    assert.equal(aggregate_totals.enrollDifference, 200);

  });

  test('#enrollDeltaDifference is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollWithActionDelta: 400,
      enrollNoActionDelta: 200
    });

    assert.equal(aggregate_totals.enrollDeltaDifference, 200);

  });

  test('#capacityNoAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityFuture: 400,
      scaCapacityIncrease: 200
    });

    assert.equal(aggregate_totals.capacityNoAction, 600);

  });

  test('#capacityNoActionDelta is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityNoAction: 400,
      capacityExisting: 200
    });

    assert.equal(aggregate_totals.capacityNoActionDelta, 200);

  });

  test('#capacityWithAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityNoAction: 400,
      newCapacityWithAction: 200
    });

    assert.equal(aggregate_totals.capacityWithAction, 600);

  });

  test('#capacityWithActionDelta is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityWithAction: 400,
      capacityExisting: 200
    });

    assert.equal(aggregate_totals.capacityWithActionDelta, 200);

  });

  test('#capacityDifference is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityWithAction: 400,
      capacityNoAction: 200
    });

    assert.equal(aggregate_totals.capacityDifference, 200);

  });

  test('#capacityDeltaDifference is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityWithActionDelta: 400,
      capacityNoActionDelta: 200
    });

    assert.equal(aggregate_totals.capacityDeltaDifference, 200);

  });

  test('#seatsNoAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityNoAction: 400,
      enrollNoAction: 200
    });

    assert.equal(aggregate_totals.seatsNoAction, 200);

  });

  test('#seatsWithAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      capacityNoAction: 400,
      enrollWithAction: 200
    });

    assert.equal(aggregate_totals.seatsWithAction, 200);

  });

  test('#seatsDifference is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      seatsWithAction: 400,
      seatsNoAction: 200
    });

    assert.equal(aggregate_totals.seatsDifference, 200);

  });

  test('#utilizationNoAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollNoAction: 177,
      capacityNoAction: 181
    });

    assert.equal(aggregate_totals.utilizationNoAction, 0.978);

  });

  test('#utilizationWithAction is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      enrollWithAction: 177,
      capacityNoAction: 181
    });

    assert.equal(aggregate_totals.utilizationWithAction, 0.978);

  });

  test('#utilizationChange is calculated correctly', function(assert) {
    let aggregate_totals = AggregateTotals.create({
      utilizationWithAction: 100.44444,
      utilizationNoAction: 50.33333
    });

    assert.equal(aggregate_totals.utilizationChange, 50.1111);

  });

  test('#impact is calculated correctly', function(assert) {
    let aggregate_totals =
    AggregateTotals.create({
      utilizationChange: 1,
      utilizationWithAction: 0.8
    });

    assert.equal(aggregate_totals.impact, false);

  });
});
