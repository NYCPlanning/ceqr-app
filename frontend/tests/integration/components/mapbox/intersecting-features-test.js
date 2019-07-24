import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/intersecting-features', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders, recomputes', async function(assert) {
    this.map = {
      instance: {
        queryRenderedFeatures: () => [],
      },
    };

    this.point = { x: 0, y: 0 };

    await render(hbs`
      {{#mapbox/intersecting-features
        map=map
        point=point
        as |features|
      }}
        {{features.length}}
      {{/mapbox/intersecting-features}}
    `);

    assert.equal(this.element.textContent.trim(), '0');

    this.map.instance.queryRenderedFeatures = () => [{ type: 'Feature' }];
    this.set('point', { x: 1, y: 1 });

    await settled();

    assert.equal(this.element.textContent.trim(), '1');
  });
});
