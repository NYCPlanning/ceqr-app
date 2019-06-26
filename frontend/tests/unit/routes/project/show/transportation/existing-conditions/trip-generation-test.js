import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project/show/transportation/existing-conditions/trip-generation', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project/show/transportation/existing-conditions/trip-generation');
    assert.ok(route);
  });

  test('it is bound to the project controller', function(assert) {
    let route = this.owner.lookup('route:project/show/transportation/existing-conditions/trip-generation');
    assert.equal(route.controllerName, 'project');
  });
});
