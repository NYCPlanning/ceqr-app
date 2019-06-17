import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Integration | Helper | get-split-percent', function(hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it calculates and formats a numeric percent', async function(assert) {
    // If modalSplit is a valid modal-split object
    const modalSplit = this.owner.lookup('service:readonly-ceqr-data-store').find();
    this.set('modalSplit', modalSplit);

    // and variables contains two valid modal-split variables
    const variables = ['trans_total', 'trans_auto_total'];
    this.set('variables', variables);

    // When modalSplit and variables are passed to the helper
    await render(hbs`{{get-split-percent modalSplit variables}}`);

    // Then a numeric percent is calculated, rounded to one decimal, and formatted with a %
    assert.ok(this.element.textContent.trim().match(/\d+\.\d\s%/));
  });
});
