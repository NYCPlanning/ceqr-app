import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../../../helpers/stub-readonly-store';

module('Integration | Component | transportation/census-tracts-table/value-row', function(hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it creates a row with title and numeric values', async function(assert) {
    // If title is a string
    this.set('title', 'testTitle');
    // And modal splits contains a modal split record
    const modalSplits = this.owner.lookup('service:readonly-ceqr-data-store').findByIds('ACS', ['1']);
    this.set('modalSplits', modalSplits);
    // And variable is a valid modal-split variable
    this.set('variable', 'trans_total');

    // When component is rendered with title, modalSplits, and variable
    await render(hbs`{{transportation/census-tracts-table/value-row title=title allModalSplitData=modalSplits variable=variable}}`);

    // Then the title, variable value, and total variable value will be rendered
    const row = find('tr');
    assert.ok(row.textContent.match(/testTitle\s+\d+\s+\d+/));
  });
});
