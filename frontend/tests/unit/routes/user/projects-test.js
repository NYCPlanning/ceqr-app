import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | user/projects', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:user/projects');
    assert.ok(route);
  });
});
