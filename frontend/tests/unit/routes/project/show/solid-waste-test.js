import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project/show/solid-waste', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project/show/solid-waste');
    assert.ok(route);
  });
});
