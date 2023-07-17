import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | mapColorFor', function (hooks) {
  setupRenderingTest(hooks);

  test('it outputs color hex given a Public School level', async function (assert) {
    this.set('inputValue', 'ps');

    await render(hbs`{{map-color-for inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'color: #414F70');
  });
});
