import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import stubReadonlyStore from '../../../../../helpers/stub-readonly-store';

module('Integration | Component | transportation/study-area-map/census-tract-popup/modal-split-formatter', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  const transTotal = 10;
  const mode = 'mode';
  const moe = 1;
  const population = 15;
  const modalSplit = {
    trans_total: { variable: 'trans_total', value: transTotal, mode, moe},
    some_madeup_var: { variable: 'some_madeup_var' },
    population: { variable: 'population', value: population },
  };
  stubReadonlyStore(hooks, modalSplit);

  test('it properly displays population and modal split data', async function(assert) {
    // If the modal split defined above is 'data'
    this.data = await this.owner.lookup('service:readonly-ceqr-data-store').find();

    // When component is rendered with data
    await render(hbs`
      {{transportation/study-area-map/census-tract-popup/modal-split-formatter data=data}}
    `);

    // Then it will be rendered correctly, excluding variables not in MODAL_SPLIT_POPUP_DISPLAY_VARIABLES
    assert.equal(find('[data-test-population]').textContent.trim(), `Population: ${population}`);
    assert.equal(find(`[data-test-value="trans_total"]`).textContent.trim(), transTotal);
    assert.equal(find(`[data-test-mode="trans_total"]`).textContent.trim(), mode);
    assert.equal(find(`[data-test-moe="trans_total"]`).textContent.trim(), moe);
    assert.notOk(find(`[data-test-value="some_madeup_var"]`));
  });
});
