import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | transportation planning factor', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  skip('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('transportation-planning-factor', {});
    assert.ok(model);
  });
});
