import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import stubReadonlyStore from '../../../../../helpers/stub-readonly-store';

module('Integration | Component | transportation/census-tracts-map/census-tract-popup/modal-split-formatter', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  stubReadonlyStore(hooks);

  test('it properly displays population and modal split data', async function(assert) {
    // If there is acs and ctpp census estimate data
    this.acsData = await this.owner.lookup('service:readonly-ceqr-data-store').find('ACS', 'acsgeoid');
    this.ctppData = await this.owner.lookup('service:readonly-ceqr-data-store').find('CTPP', 'acsgeoid');

    // When component is rendered with the data
    await render(hbs`
      {{transportation/census-tracts-map/census-tract-popup/modal-split-formatter acsData=acsData ctppData=ctppData}}
    `);

    // Then it will be rendered correctly, excluding variables not in MODAL_SPLIT_POPUP_DISPLAY_VARIABLES
    assert.equal(find('[data-test-population]').textContent.trim(), this.acsData.population.value);
    assert.equal(find('[data-test-workers]').textContent.trim(), this.ctppData.workers.value);
    assert.equal(find(`[data-test-mode="trans_auto_total"]`).textContent.trim(), this.acsData.trans_auto_total.mode);
    assert.ok(find(`[data-test-acs-value="trans_auto_total"]`).textContent.includes(this.acsData.trans_auto_total.value));
    assert.ok(find(`[data-test-acs-percent="trans_auto_total"]`).textContent.includes('%'));
    assert.ok(find(`[data-test-ctpp-value="trans_auto_total"]`).textContent.includes(this.ctppData.trans_auto_total.value));
    assert.ok(find(`[data-test-ctpp-percent="trans_auto_total"]`).textContent.includes('%'));
    assert.notOk(find(`[data-test-value="trans_home"]`));
  });
});
