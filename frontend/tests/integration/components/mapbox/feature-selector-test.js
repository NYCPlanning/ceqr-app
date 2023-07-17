import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/feature-selector', function (hooks) {
  setupRenderingTest(hooks);

  test('it yields the result of queryRenderedFeatures on click event', async function (assert) {
    const point = 'test';
    const events = {};
    this.map = {
      instance: {
        on(event, action) {
          events[event] = action;
        },
        off() {},
        queryRenderedFeatures: (point) => point,
      },
    };

    // If the component is rendered with a map that returns the point passed to queryRenderedFeatures
    await render(hbs`
      {{#mapbox/feature-selector map=map layerId='test' as |selectedFeatures| }}
        {{selectedFeatures}}
      {{/mapbox/feature-selector}}
    `);

    // When the event registered for "click" event is called with an object containing "point" property
    events.click({ point });
    await settled();

    // Then the component should yield the result of queryRenderedFeatures
    assert.equal(this.element.textContent.trim(), point);
  });
});
