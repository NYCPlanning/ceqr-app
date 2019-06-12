import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project/show/transportation/existing-conditions/journey-to-work', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project/show/transportation/existing-conditions/journey-to-work');
    assert.ok(route);
  });
});
