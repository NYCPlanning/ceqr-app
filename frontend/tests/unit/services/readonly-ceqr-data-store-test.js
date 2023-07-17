import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | readonly-ceqr-data-store', function (hooks) {
  setupTest(hooks);

  test('it adds and gets', function (assert) {
    // If an initialized service exists
    const service = this.owner.lookup('service:readonly-ceqr-data-store');
    service.init();
    // And it has a record
    service.add('testType', 'testId', { value: 'testValue' });

    // When the record is retrieved
    const obj = service.getRecord('testType', 'testId');

    // Then it is the correct record
    assert.equal(obj.value, 'testValue');
  });

  test('it finds a record that already exists with getRecord()', function (assert) {
    // If an initialized service exists
    const service = this.owner.lookup('service:readonly-ceqr-data-store');
    service.init();
    const testType = 'testType';
    const testId = 'testId';
    service.getRecord = (type, id) => {
      assert.equal(type, testType);
      assert.equal(id, testId);
      return 'value';
    };

    // And it has a record
    service.add(testType, testId, 'value');

    // When the record is requested
    service.find(testType, testId);

    // Then getRecord() is called with the given type and id (assertions defined above)
  });

  test('it finds a record that does not exist with fetch()', function (assert) {
    // If an initialized service exists
    const service = this.owner.lookup('service:readonly-ceqr-data-store');
    service.init();
    const testType = 'testType';
    const testId = 'testId';
    service._fetch = (type, id) => {
      assert.equal(type, testType);
      assert.equal(id, testId);
      return 'value';
    };

    // When a record that does not exist in local store is requested
    service.find(testType, testId);

    // Then fetch() is called with the given type and id (assertions defined above)
  });

  test('it calls find() for each id passed to findById', function (assert) {
    // If an initialized service exists
    const service = this.owner.lookup('service:readonly-ceqr-data-store');
    service.init();
    const testType = 'testType';
    const testIds = ['1', '2', '3'];
    service.find = (type, id) => {
      assert.equal(type, testType);
      assert.ok(testIds.includes(id));
      return 'value';
    };
    assert.expect(6);

    // When records are requested
    service.findByIds(testType, testIds);

    // Then find is called for each of the ids for the given type (assertions defined above)
  });
});
