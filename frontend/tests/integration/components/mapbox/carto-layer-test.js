import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/carto-layer', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{mapbox/carto-layer}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it call registration and tears down', async function(assert) {
    assert.expect(2);

    this.handler = function() {
      assert.ok(true);
    };

    await render(hbs`
      {{mapbox/carto-layer
        registerWithParent=(action this.handler)
        unregisterWithParent=(action this.handler)
      }}
    `);

    await clearRender();
  });
});
