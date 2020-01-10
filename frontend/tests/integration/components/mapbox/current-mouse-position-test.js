import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/current-mouse-position', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const events = {};
    this.map = {
      instance: {
        on(event, action) {
          events[event] = action;
        },
        off() {},
      },
    };

    await render(hbs`
      {{#mapbox/current-mouse-position map=map as |mousePoint|}}
        {{mousePoint.x}}
      {{/mapbox/current-mouse-position}}
    `);

    events.mousemove({ point: { x: 0, y: 0 } });

    await settled();

    assert.equal(this.element.textContent.trim(), '0');
  });
});
