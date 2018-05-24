import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:building', 'Unit | Transform | building', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:building');
    assert.ok(transform);
  });
});
