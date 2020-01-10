import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/current-mouse-event', function(hooks) {
  setupRenderingTest(hooks);

  test('it yields event arguments for the bound event', async function(assert) {
    const events = {};
    this.map = {
      instance: {
        on(event, action) {
          events[event] = action;
        },
        off() {},
      },
    };

    // if the mouse event template is rendered for event='click'
    await render(hbs`
      {{#mapbox/current-mouse-event mapboxEventName="click" map=map as |mapboxMapEvent|}}
        {{mapboxMapEvent}}
      {{/mapbox/current-mouse-event}}
    `);

    // when the registered function is called with an argument
    events.click('eventArgs');
    await settled();

    // then the point will be yielded by the component
    assert.equal(this.element.textContent.trim(), 'eventArgs');
  });
});
