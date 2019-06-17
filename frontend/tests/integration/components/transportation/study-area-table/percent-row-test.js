import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../../../helpers/stub-readonly-store';

module('Integration | Component | transportation/study-area-table/percent-row', function(hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it creates a row with title and numeric percent', async function(assert) {
    // If title is a string
    this.set('title', 'testTitle');
    // And modal splits contains a modal split record
    const modalSplits = this.owner.lookup('service:readonly-ceqr-data-store').findByIds(['1']);
    this.set('modalSplits', modalSplits);
    // And variables contains a valid modal-split variable
    this.set('variables', ['trans_total']);

    // When component is rendered with title, modalSplits, and variables
    await render(hbs`{{transportation/study-area-table/percent-row title=title allModalSplitData=modalSplits variables=variables}}`);

    // Then the title, variable percent, total variable percent will be rendered
    const row = find('tr');
    assert.ok(row.textContent.match(/testTitle\s+\d+\.\d\s+%\s+\d+\.\d\s+%/));
  });
});
