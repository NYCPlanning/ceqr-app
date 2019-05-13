import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import Building from 'labs-ceqr/fragments/public-schools/Building';

module('Unit | Fragment | Building', function(hooks) {
  setupTest(hooks);

  test('seats are calculated correctly', function(assert) {
    let lcgms_building = Building.create({
      "enroll": 115,
      "capacity": "",
      "excluded": false,
    });

    let bluebook_building = Building.create({
      "enroll": 115,
      "capacity": 234,
      "excluded": false,
    });

    let excluded_building = Building.create({
      "enroll": 115,
      "capacity": 234,
      "excluded": true,
    });

    assert.equal(lcgms_building.seats, 0);
    assert.equal(bluebook_building.seats, 119);
    assert.equal(excluded_building.seats, -115);
  });

  test('utilization is calculated correctly', function(assert) {
    let building = Building.create({
      "enroll": 116,
      "capacity": 234,
      "excluded": false,
    });

    assert.equal(building.utilization, 0.496)
  });

  test('capacity delta is calculated correctly', function(assert) {
    let building = Building.create({
      "enroll":116,
      "capacity": 234,
      "capacityFuture": 255,
    });

    assert.equal(building.capacityDelta, 21)
  });
});
