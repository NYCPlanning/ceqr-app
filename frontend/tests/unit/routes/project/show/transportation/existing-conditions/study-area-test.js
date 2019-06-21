import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project/show/transportation/existing-conditions/study-area', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project/show/transportation/existing-conditions/study-area');
    assert.ok(route);
  });

  test('it is bound to the project controller', function(assert) {
    let route = this.owner.lookup('route:project/show/transportation/existing-conditions/study-area');
    assert.equal(route.controllerName, 'project');
  });

});
