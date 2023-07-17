import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../../../helpers/stub-readonly-store';

module(
  'Integration | Component | transportation/census-tracts-table/value-and-percent-row',
  function (hooks) {
    setupRenderingTest(hooks);
    stubReadonlyStore(hooks);

    skip('it creates a row with title and pair of numeric count and percent', async function (assert) {
      // If title is a string
      this.set('title', 'testTitle');
      // And modal splits contains a modal split record
      const modalSplits = this.owner
        .lookup('service:readonly-ceqr-data-store')
        .findByIds('ACS-modal-split', ['1']);
      this.set('modalSplits', modalSplits);
      // And variables is a valid array of modal-split variables
      this.set('variables', ['trans_total']);

      // When component is rendered with title, modalSplits, and variables array
      await render(hbs`{{transportation/census-tracts-table/value-and-percent-row
      title=title allModalSplitData=modalSplits
      variables=variables
    }}`);

      // Then it renders the title, variable count and percent, and total variable count and percent
      const row = find('tr');
      assert.ok(
        row.textContent.match(
          /testTitle\s+\d+\s+\d+\.\d+\s%\s+\d+\s±\d+\s+\d+\.\d+\s%/
        )
      );
    });
  }
);
