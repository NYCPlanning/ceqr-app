import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | transportation/tdf/modal-splits/census-tract-table-cell/total', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{transportation/tdf/modal-splits/census-tract-table-cell/total}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#transportation/tdf/modal-splits/census-tract-table-cell/total}}
        template block text
      {{/transportation/tdf/modal-splits/census-tract-table-cell/total}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
