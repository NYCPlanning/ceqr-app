import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | schoolYear', function(hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it renders', async function(assert) {
    this.set('inputValue', { minYear: 2010, maxYear: 2011 });

    await render(hbs`{{school-year inputValue}}`);

    assert.equal(this.element.textContent.trim(), '2010-2011');
  });
});
