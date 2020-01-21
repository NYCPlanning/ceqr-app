import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | humanize-geoid', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', '48201223155');

    await render(hbs`{{humanize-geoid inputValue}}`);

    assert.dom(this.element).hasText('2231.55');
  });
});
