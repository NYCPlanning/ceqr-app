import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import SchoolTotals from 'labs-ceqr/fragments/public-schools/SchoolTotals';
import Building from 'labs-ceqr/fragments/public-schools/Building';

module('Unit | Fragment | SchoolTotals', function(hooks) {
  setupTest(hooks);

  test('#buildings returns correct filters list', function(assert) {
    let buildings =  [
      Building.create({
        level: 'hs',
        district: 1,
        subdistrict: 2
      }),
      Building.create({
        level: 'ps',
        district: 1,
        subdistrict: 2
      }),
      Building.create({
        level: 'ps',
        district: 1,
        subdistrict: 3
      }),
      Building.create({
        level: 'is',
        district: 1,
        subdistrict: 2
      }),
    ];

    let hs_school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.deepEqual(hs_school_totals.buildings, [
      Building.create({
        level: 'hs',
        district: 1,
        subdistrict: 2
      })
    ]);

    let ps_school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'ps',
      district: 1,
      subdistrict: 2
    });

    assert.deepEqual(ps_school_totals.buildings, [
      Building.create({
        level: 'ps',
        district: 1,
        subdistrict: 2
      })
    ]);
  });

  test('#enrollmentTotal returns correct calculation', function(assert) {
    let buildings = [
      Building.create({
        level: 'hs',
        enroll: 125
      }),
      Building.create({
        level: 'hs',
        enroll: 100
      })
    ];

    let school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.equal(school_totals.enrollmentTotal, 225);

  });

test('#capacityTotal returns correct calculation', function(assert) {
  let buildings = [
    Building.create({
      level: 'hs',
      capacity: 140
    }),
    Building.create({
      level: 'hs',
      capacity: 130
    }),
    Building.create({
      level: 'hs',
      capacity: 400,
      excluded: true
    })
  ];

  let school_totals = SchoolTotals.create({
    allBuildings: buildings,
    level: 'hs'
  });

  assert.equal(school_totals.capacityTotal, 270);

  });

  test('#capacityTotalNoAction returns correct calculation', function(assert) {
    let buildings = [
      Building.create({
        level: 'hs',
        capacityFuture: 160
      }),
      Building.create({
        level: 'hs',
        capacityFuture: 145
      }),
      Building.create({
        level: 'hs',
        capacityFuture: 300,
        excluded: true
      }),
    ];

    let school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.equal(school_totals.capacityTotalNoAction, 305);

  });

  test('#seatsTotal returns correct calculation', function(assert) {
    let buildings = [
      Building.create({
        level: 'hs',
        seats: 160
      }),
      Building.create({
        level: 'hs',
        seats: 145
      })
    ];

    let school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'hs'
    });

    assert.equal(school_totals.seatsTotal, 305);

  });

  test('#utilizationTotal returns correct calculation', function(assert) {
    let school_totals = SchoolTotals.create({
      level: 'hs',
      enrollmentTotal: 102,
      capacityTotal:  177
    });

    assert.equal(school_totals.utilizationTotal, 0.576);

  });

  test('#enrollmentMetaTotal returns correct calculation', function(assert) {
    let buildings = [
      Building.create({
        level: 'hs',
        enroll: 160
      }),
      Building.create({
        level: 'hs',
        enroll: 170
      }),
      Building.create({
        level: 'ps',
        enroll: 145
      }),
      Building.create({
        level: 'ps',
        enroll: 140
      })
    ];

    let school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'ps'
    });

    assert.equal(school_totals.enrollmentMetaTotal, 285);

  });

  test('#capacityMetaTotal returns correct calculation', function(assert) {
    let buildings = [
      Building.create({
        level: 'hs',
        capacity: 160
      }),
      Building.create({
        level: 'hs',
        capacity: 170
      }),
      Building.create({
        level: 'ps',
        capacity: 145
      }),
      Building.create({
        level: 'ps',
        capacity: 140
      }),
      Building.create({
        level: 'ps',
        capacity: 200,
        excluded: true
      })
    ];

    let school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'ps'
    });

    assert.equal(school_totals.capacityMetaTotal, 285);

  });

  test('#seatsMetaTotal returns correct calculation', function(assert) {
    let buildings = [
      Building.create({
        level: 'hs',
        seats: 160
      }),
      Building.create({
        level: 'hs',
        seats: 170
      }),
      Building.create({
        level: 'ps',
        seats: 145
      }),
      Building.create({
        level: 'ps',
        seats: 140
      })
    ];

    let school_totals = SchoolTotals.create({
      allBuildings: buildings,
      level: 'ps'
    });

    assert.equal(school_totals.seatsMetaTotal, 285);

  });

  test('#utilizationMetaTotal returns correct calculation', function(assert) {
    let school_totals = SchoolTotals.create({
      level: 'hs',
      enrollmentMetaTotal: 131,
      capacityMetaTotal:  145
    });

    assert.equal(school_totals.utilizationMetaTotal, 0.903);

  });
});
