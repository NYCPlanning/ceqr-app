import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | transportation/study-area-map/census-tract-popup/modal-split-formatter', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it properly displays population and modal split data', async function(assert) {
    // If census tracts records exist with given values
    const geoid = '1';
    this.geoid = geoid;

    const population = 500;
    this.server.create('transportation-census-estimate', {geoid: '1', variable: 'population', value: population });
    const variable = 'variable';
    const value = 10;
    const moe = 1;
    this.server.create('transportation-census-estimate', {geoid: '1', variable, value, moe });

    // When those census tract records are passed into the component
    this.data = await this.owner.lookup('service:store').query('transportation-census-estimate', { geoid: '1'});
    await render(hbs`
      {{transportation/study-area-map/census-tract-popup/modal-split-formatter data=data}}
    `);

    // Then they will be rendered correctly
    assert.equal(find('[data-test-population]').textContent.trim(), `Population: ${population}`);
    assert.equal(find(`[data-test-mode="${variable}"]`).textContent.trim(), 'Unknown');
    assert.equal(find(`[data-test-value="${variable}"]`).textContent.trim(), value);
    assert.equal(find(`[data-test-moe="${variable}"]`).textContent.trim(), moe);
  });
});
