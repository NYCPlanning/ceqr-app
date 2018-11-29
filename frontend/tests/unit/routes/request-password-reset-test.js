import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | request-password-reset', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:request-password-reset');
    assert.ok(route);
  });
});
