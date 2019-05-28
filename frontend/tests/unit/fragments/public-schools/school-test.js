import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import School from 'labs-ceqr/fragments/public-schools/School';

module('Unit | Fragment | School', function(hooks) {
  setupTest(hooks);

  test('seats are calculated correctly', function(assert) {
    let lcgms_school = School.create({
      "enroll": 115,
      "capacity": "",
      "excluded": false,
    });

    let bluebook_school = School.create({
      "enroll": 115,
      "capacity": 234,
      "excluded": false,
    });

    let excluded_school = School.create({
      "enroll": 115,
      "capacity": 234,
      "excluded": true,
    });

    assert.equal(lcgms_school.seats, 0);
    assert.equal(bluebook_school.seats, 119);
    assert.equal(excluded_school.seats, -115);
  });

  test('utilization is calculated correctly', function(assert) {
    let school = School.create({
      "enroll": 116,
      "capacity": 234,
      "excluded": false,
    });

    assert.equal(school.utilization, 0.496)
  });

  test('capacity delta is calculated correctly', function(assert) {
    let school = School.create({
      "enroll":116,
      "capacity": 234,
      "capacityFuture": 255,
    });

    assert.equal(school.capacityDelta, 21)
  });
});
