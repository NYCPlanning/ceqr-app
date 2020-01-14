import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Integration | Helper | get-aggregate-percent', function(hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it calculates and formats a numeric percent', async function(assert) {
    // If modalSplits contains two modal split records
    const modalSplits = this.owner.lookup('service:readonly-ceqr-data-store').findByIds('ACS-modal-split', ['1', '2']);
    this.set('modalSplits', modalSplits);

    // and variables contains two valid modal-split variables
    const variables = ['trans_total', 'trans_auto_total'];
    this.set('variables', variables);

    // When modalSplits and variables are passed to the helper
    await render(hbs`{{get-aggregate-percent modalSplits variables}}`);

    // Then a numeric percent is calculated, rounded to one decimal, and formatted with a %
    assert.ok(this.element.textContent.trim().match(/\d+\.\d\s%/));
  });
});
