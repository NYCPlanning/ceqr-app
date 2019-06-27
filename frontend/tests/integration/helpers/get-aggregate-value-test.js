import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Integration | Helper | get-aggregate-value', function(hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it calculates a numeric sum', async function(assert) {
    // If modal splits contains two modal split records
    const modalSplits = this.owner.lookup('service:readonly-ceqr-data-store').findByIds('ACS-modal-split', ['1','2']);
    this.set('modalSplits', modalSplits);

    // and variable is a valid modal-split variable
    this.set('variable', 'trans_total');

    // When modalSplits and variable are passed to the helper
    await render(hbs`{{get-aggregate-value modalSplits variable}}`);

    // Then a numeric sum is calculated
    assert.ok(this.element.textContent.trim().match(/\d+/));
  });
});
