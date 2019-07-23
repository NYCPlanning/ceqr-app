import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | get-color-style', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns a color style attribute string', async function(assert) {
    this.set('color', '#000000');

    await render(hbs`{{get-color-style color}}`);

    assert.equal(this.element.textContent.trim(), `color:${this.color}`);
  });
});
