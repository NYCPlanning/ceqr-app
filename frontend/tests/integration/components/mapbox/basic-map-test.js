import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/basic-map', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      <Mapbox::BasicMap
        @initOptions={{hash
          style="https://layers-api.planninglabs.nyc/v1/base/style.json"
          zoom=14
          center=(array 0 0)
        }} 
      />
    `);

    assert.ok(this.element.querySelector('canvas'));
  });
});
