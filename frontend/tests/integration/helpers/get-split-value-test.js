import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Integration | Helper | get-split-value', function (hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it gets a split value', async function (assert) {
    // If modalSplit is a valid modal-split object
    const modalSplit = this.owner
      .lookup('service:readonly-ceqr-data-store')
      .find();
    this.set('modalSplit', modalSplit);

    // and variable is a valid modal-split variable
    const variable = 'trans_total';
    this.set('variable', variable);

    // When modalSplit and variable are passed to the helper
    await render(hbs`{{get-split-value modalSplit variable}}`);

    // Then a numeric split value is returned
    assert.ok(this.element.textContent.trim().match(/\d+/));
  });
});
