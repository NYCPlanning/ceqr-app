import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Model | transportation planning factor', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('assure that default values are set when model created', async function(assert) {
    let store = this.owner.lookup('service:store');

    // when the model is created without the keys for objects, it will trigger
    // the defaultValue. If it's an empty object, it will use that empty object
    await store.createRecord('transportation-planning-factor', {});
    let model = store.peekAll('transportation-planning-factor').firstObject;

    assert.ok(model.inOutSplits.am);
    assert.ok(model.inOutSplits.md);
    assert.ok(model.inOutSplits.pm);
    assert.ok(model.inOutSplits.saturday);

    assert.ok(model.truckInOutSplits.allDay);

    assert.equal(model.modeSplitsFromUser.auto.am, 0);
    assert.equal(model.modeSplitsFromUser.auto.md, 0);
    assert.equal(model.modeSplitsFromUser.auto.pm, 0);
    assert.equal(model.modeSplitsFromUser.auto.saturday, 0);
    assert.equal(model.modeSplitsFromUser.auto.allPeriods, 0);

    assert.ok(model.vehicleOccupancyFromUser.auto);
    assert.ok(model.vehicleOccupancyFromUser.taxi);

    assert.ok(model);
  });

  test('assure that mutating a default fragment value triggers dirty state for inOutSplits', async function(assert) {
    let store = this.owner.lookup('service:store');

    // when the model is created without the keys for objects, it will trigger
    // the defaultValue. If it's an empty object, it will use that empty object
    const record = await store.createRecord('transportation-planning-factor', {});

    assert.equal(record.hasDirtyAttributes, true);

    await record.save();

    assert.equal(record.hasDirtyAttributes, false);
    record.inOutSplits.set('am', { in: 100 });
    assert.equal(record.hasDirtyAttributes, true);
    assert.equal(record.inOutSplits.am.in, 100);
    assert.equal(record.inOutSplits.am.out, 50);
    await record.save();
    assert.equal(record.hasDirtyAttributes, false);
  });

  test('assure that mutating a default fragment value triggers dirty state for truckInOutSplits', async function(assert) {
    let store = this.owner.lookup('service:store');

    // when the model is created without the keys for objects, it will trigger
    // the defaultValue. If it's an empty object, it will use that empty object
    const record = await store.createRecord('transportation-planning-factor', {});

    assert.equal(record.hasDirtyAttributes, true);

    await record.save();

    assert.equal(record.hasDirtyAttributes, false);
    record.truckInOutSplits.set('allDay', { in: 20 });
    assert.equal(record.hasDirtyAttributes, true);
    assert.equal(record.truckInOutSplits.allDay.in, 20);
    assert.equal(record.truckInOutSplits.allDay.out, 50);
    await record.save();
    assert.equal(record.hasDirtyAttributes, false);
  });

  test('assure that mutating a default fragment value triggers dirty state for modeSplitsFromUser', async function(assert) {
    let store = this.owner.lookup('service:store');

    // when the model is created without the keys for objects, it will trigger
    // the defaultValue. If it's an empty object, it will use that empty object
    const record = await store.createRecord('transportation-planning-factor', {});

    assert.equal(record.hasDirtyAttributes, true);

    await record.save();

    assert.equal(record.hasDirtyAttributes, false);
    record.modeSplitsFromUser.set('auto', { am: 100 });
    assert.equal(record.hasDirtyAttributes, true);
    await record.save();
    assert.equal(record.hasDirtyAttributes, false);
  });

  test('assure that mutating a default fragment value triggers dirty state for vehicleOccupancyUser', async function(assert) {
    let store = this.owner.lookup('service:store');

    // when the model is created without the keys for objects, it will trigger
    // the defaultValue. If it's an empty object, it will use that empty object
    const record = await store.createRecord('transportation-planning-factor', {});

    assert.equal(record.hasDirtyAttributes, true);

    await record.save();

    assert.equal(record.hasDirtyAttributes, false);
    record.vehicleOccupancyFromUser.set('auto', { am: 2 });
    assert.equal(record.hasDirtyAttributes, true);
    assert.equal(record.vehicleOccupancyFromUser.auto.am, 2);
    await record.save();
    assert.equal(record.hasDirtyAttributes, false);
  });
});
