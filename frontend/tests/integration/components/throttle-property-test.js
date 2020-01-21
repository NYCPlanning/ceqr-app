import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | throttle-property', function(hooks) {
  setupRenderingTest(hooks);

  test('it throttles property update by given timeout', async function(assert) {
    this.propertyToThrottle = 'original';

    await render(hbs`
      {{#throttle-property property=propertyToThrottle timeout=1000 as |property|}}
        {{property}}
      {{/throttle-property}}
    `);

    this.set('propertyToThrottle', 'update');

    // given assert runs before the throttle timeout, value of property is unchanged
    assert.dom(this.element).hasText('original');

    await settled();

    // after throttle resolves, property should be updated
    assert.dom(this.element).hasText('update');
  });

  test('it passes through the prop even without subsequent updates', async function(assert) {
    this.propertyToThrottle = 1;

    await render(hbs`
      {{#throttle-property property=propertyToThrottle milliseconds=1000 as |property|}}
        {{property}}
      {{/throttle-property}}
    `);

    assert.dom(this.element).hasText('1');
  });
});
