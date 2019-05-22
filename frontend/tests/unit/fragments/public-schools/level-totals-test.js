import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import SubdistrictLevelTotals from 'labs-ceqr/fragments/public-schools/SubdistrictLevelTotals';
import LevelTotals from 'labs-ceqr/fragments/public-schools/LevelTotals';

module('Unit | Fragment | LevelTotals', function(hooks) {
  setupTest(hooks);

  test('#enrollTotal is calculated correctly', function(assert) {
    let aggregate_totals =
    SubdistrictLevelTotals.create({
      enrollTotal: 400
    });

    let school_level_totals =
    LevelTotals.create({
      subdistrictTotals: aggregate_totals,
    });

    assert.equal(school_level_totals.subdistricts.enrollTotal, 400);

  });

  test('#studentsTotal is calculated correctly', function(assert) {
    let aggregate_totals =
    SubdistrictLevelTotals.create({
      studentsTotal: 400
    });

    let school_level_totals =
    LevelTotals.create({
      subdistrictTotals: aggregate_totals,
    });

    assert.equal(school_level_totals.subdistricts.studentsTotal, 400);

  });

  test('#enrollNoActionTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      enrollTotal: 100,
      studentsTotal: 300,
    });

    assert.equal(school_level_totals.enrollNoActionTotal, 400);

  });

  test('#enrollWithActionTotal is calculated correctly', function(assert) {
    let aggregate_totals =
    SubdistrictLevelTotals.create({
      enrollWithActionTotal: 400
    });

    let school_level_totals =
    LevelTotals.create({
      subdistrictTotals: aggregate_totals,
    });

    assert.equal(school_level_totals.subdistricts.enrollWithActionTotal, 400);

  });

  test('#capacityNoActionTotal is calculated correctly', function(assert) {
    let aggregate_totals =
    SubdistrictLevelTotals.create({
      capacityNoActionTotal: 400
    });

    let school_level_totals =
    LevelTotals.create({
      subdistrictTotals: aggregate_totals,
    });

    assert.equal(school_level_totals.subdistricts.capacityNoActionTotal, 400);

  });

  test('#capacityWithActionTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      capacityNoActionTotal: 100,
      newSchoolSeats: 300
    });

    assert.equal(school_level_totals.capacityWithActionTotal, 400);

  });

  test('#seatsNoActionTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      capacityNoActionTotal: 400,
      enrollNoActionTotal: 300
    });

    assert.equal(school_level_totals.seatsNoActionTotal, 100);

  });

  test('#seatsWithActionTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      capacityWithActionTotal: 400,
      enrollWithActionTotal: 300
    });

    assert.equal(school_level_totals.seatsWithActionTotal, 100);

  });

  test('#utilizationNoActionTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      enrollNoActionTotal: 177,
      capacityNoActionTotal: 145
    });

    assert.equal(school_level_totals.utilizationNoActionTotal, 1.2207);

  });

  test('#utilizationWithActionTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      enrollWithActionTotal: 177,
      capacityWithActionTotal: 145
    });

    assert.equal(school_level_totals.utilizationWithActionTotal, 1.2207);

  });

  test('#utilizationChangeTotal is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      utilizationWithActionTotal: 100.66666,
      utilizationNoActionTotal: 50.55555
    });

    assert.equal(school_level_totals.utilizationChangeTotal, 50.1111);

  });

  test('#impact is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      utilizationChangeTotal: 1,
      utilizationWithActionTotal: 0.8
    });

    assert.equal(school_level_totals.impact, false);

  });

  test('#mitigateSeatCount is calculated correctly', function(assert) {
    let school_level_totals =
    LevelTotals.create({
      enrollWithActionTotal: 7,
      capacityWithActionTotal: 2,
      utilizationNoActionTotal: 3
    });

    // seatsToMitigateUtilization = enrollWithActionTotal - capacityWithActionTotal - 1
    // seatsToMitigateUtilization = 7 - 2 - 1 = 4
    // seatsToMitigateChange = (enrollWithActionTotal / (utilizationNoActionTotal + 0.0499)) - capacityWithActionTotal
    // seatsToMitigateChange = (7 / (3 + 0.0499)) - 2 = 0.295157
    // Math.ceil(seatsToMitigateChange) = 1
    // seatsToMitigateUtilization > seatsToMitigateChange, SO RETURN seatsToMitigateChange,

    assert.equal(school_level_totals.mitigateSeatCount, 1);

  });

  test('#mitigateUnitCount is calculated correctly', function(assert) {
    let aggregate_totals = [
    SubdistrictLevelTotals.create({
      studentMultiplier: 2
    })
  ];

    let school_level_totals =
    LevelTotals.create({
      subdistrictTotals: aggregate_totals,
      mitigateSeatCount: 5,
    });

    assert.equal(school_level_totals.mitigateUnitCount, 3);

  });

});
