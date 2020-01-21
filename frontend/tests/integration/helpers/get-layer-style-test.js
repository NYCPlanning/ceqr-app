import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { styles } from 'labs-ceqr/layer-styles';

module('Integration | Helper | get-layer-style', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns the correct style object', async function(assert) {
    const layer = 'bbls';
    this.set('layer', layer);
    const type = 'paint';
    this.set('type', type);

    await render(hbs`{{get-layer-style layer type}}`);

    assert.dom(this.element).hasText(styles[layer][type]);
  });
});
