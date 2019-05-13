import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import AggregateTotals from 'labs-ceqr/fragments/public-schools/AggregateTotals';
import SchoolTotals from 'labs-ceqr/fragments/public-schools/SchoolTotals';

module('Unit | Fragment | AggregateTotals', function(hooks) {
  setupTest(hooks);

  test('#enrollExistingConditions is calculated correctly', function(assert) {
    let school_totals = SchoolTotals.create({
      enrollmentTotal: 300
    });

    let aggregate_totals = AggregateTotals.create({
      schoolTotals: school_totals
    });

    assert.equal(aggregate_totals.enrollExistingConditions, 300);
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

  test('#capacityExisting is calculated correctly', function(assert) {
    let school_totals = SchoolTotals.create({
      capacityTotal: 300
    });

    let aggregate_totals = AggregateTotals.create({
      schoolTotals: school_totals
    });

    assert.equal(aggregate_totals.capacityExisting, 300);
  });

  test('#capacityFuture is calculated correctly', function(assert) {
    let school_totals = SchoolTotals.create({
      capacityTotalNoAction: 300
    });

    let aggregate_totals = AggregateTotals.create({
      schoolTotals: school_totals
    });

    assert.equal(aggregate_totals.capacityFuture, 300);
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
