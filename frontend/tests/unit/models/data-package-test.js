import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | data package', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('data-package', {});
    assert.ok(model);
  });
});
