import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import School from 'labs-ceqr/fragments/public-schools/School';

module('Unit | Fragment | School', function(hooks) {
  setupTest(hooks);

  test('seats are calculated correctly', function(assert) {
    const school_a = School.create({
      enroll: 115,
      capacity: '',
      excluded: false,
    });

    const school_b = School.create({
      enroll: 115,
      capacity: 234,
      excluded: false,
    });

    const excluded_school = School.create({
      enroll: 115,
      capacity: 234,
      excluded: true,
    });

    assert.equal(school_a.seats, 0);
    assert.equal(school_b.seats, 119);
    assert.equal(excluded_school.seats, -115);
  });

  test('utilization is calculated correctly', function(assert) {
    const school = School.create({
      enroll: 116,
      capacity: 234,
      excluded: false,
    });

    assert.equal(school.utilization, 0.496);
  });

  test('capacity delta is calculated correctly', function(assert) {
    const school = School.create({
      enroll: 116,
      capacity: 234,
      capacityFuture: 255,
    });

    assert.equal(school.capacityDelta, 21);
  });
});
