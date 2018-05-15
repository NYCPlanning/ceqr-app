import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:existing-conditions', 'Unit | Transform | existing conditions', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:existing-conditions');
    assert.ok(transform);
  });
});
