import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/layer-hover-card', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.map = {
      instance: {
        queryRenderedFeatures: () => [],
        on() {},
        off() {},
      },
    };

    await render(hbs`
      {{mapbox/layer-hover-card
        map=map
        layerId='test'}}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
