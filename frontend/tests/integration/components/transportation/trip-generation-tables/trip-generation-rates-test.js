import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | transportation/trip-generation-tables/trip-generation-rates', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{transportation/trip-generation-tables/trip-generation-rates}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#transportation/trip-generation-tables/trip-generation-rates}}
        template block text
      {{/transportation/trip-generation-tables/trip-generation-rates}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
