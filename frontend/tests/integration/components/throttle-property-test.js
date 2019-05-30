import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';

module('Integration | Component | throttle-property', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(3);
    this.propertyWasUpdated = function() {
      assert.ok(true);
    }
    this.propertyToThrottle = 1;

    class TestComponent extends Component {
      didUpdateAttrs() {
        this.someAction();
      }

      someAction = () => {}

      someReceivedThrottledProp = null;
    }

    this.owner.register('component:test-component', TestComponent)

    await render(hbs`
      {{#throttle-property property=propertyToThrottle milliseconds=1000 as |property|}}
        {{test-component someReceivedThrottledProp=property someAction=(action propertyWasUpdated)}}
      {{/throttle-property}}
    `);

    this.set('propertyToThrottle', 2);
    this.set('propertyToThrottle', 3);
    this.set('propertyToThrottle', 4);
    this.set('propertyToThrottle', 5);
    this.set('propertyToThrottle', 6);
    this.set('propertyToThrottle', 7);

    // property gets updated many more times than 3, but it throttles
  });

  test('it passes through the prop even without subsequent updates', async function(assert) {
    this.propertyToThrottle = 1;

    class TestComponent extends Component {
      someReceivedThrottledProp = null;

      layout=hbs`
        {{someReceivedThrottledProp}}
      `
    }

    this.owner.register('component:test-component', TestComponent)

    await render(hbs`
      {{#throttle-property property=propertyToThrottle milliseconds=1000 as |property|}}
        {{test-component someReceivedThrottledProp=property}}
      {{/throttle-property}}
    `);

    assert.equal(this.element.textContent.trim(), '1')
  });
});
