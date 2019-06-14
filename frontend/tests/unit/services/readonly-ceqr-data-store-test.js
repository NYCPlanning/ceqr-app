import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | readonly-ceqr-data-store', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:readonly-ceqr-data-store');
    assert.ok(service);
  });
});
