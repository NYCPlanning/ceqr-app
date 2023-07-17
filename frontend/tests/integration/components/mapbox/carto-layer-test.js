import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/carto-layer', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.tiles = ['https://cooltiles.com'];
    this.map = {
      instance: {
        addLayer() {},
        removeLayer() {},
      },
    };

    await render(hbs`{{mapbox/carto-layer map=map tiles=tiles id='test'}}`);

    assert.ok(find('#test'));
  });

  test('it call registration and tears down', async function (assert) {
    assert.expect(2);

    this.handler = function () {
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

  test('it provides the layerId in block params', async function (assert) {
    this.tiles = ['https://cooltiles.com'];
    this.map = {
      instance: {
        addLayer() {},
        removeLayer() {},
      },
    };

    await render(hbs`
      {{#mapbox/carto-layer map=map tiles=tiles id='test' as |layer|}}
        {{layer.layerId}}
      {{/mapbox/carto-layer}}
    `);

    assert.equal(this.element.textContent.trim(), 'test');
  });
});
