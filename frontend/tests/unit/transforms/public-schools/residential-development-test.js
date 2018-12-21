import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('transform:public-schools/residential-development', 'Unit | Transform | public schools/residential development', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let transform = this.owner.lookup('transform:public-schools/residential-development');
    assert.ok(transform);
  });
});
