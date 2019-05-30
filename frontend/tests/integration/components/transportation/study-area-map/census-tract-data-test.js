import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | transportation/study-area-map/census-tract-data', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function(assert) {
    this.server.create('modal-split', {
      count: 9999,
    });
    this.geoid = 1;

    await render(hbs`
      {{#transportation/study-area-map/census-tract-data geoid=geoid as |censusTractData|}}
        {{#censusTractData.loaded as |data|}}
          {{data.count}}
        {{/censusTractData.loaded}}
      {{/transportation/study-area-map/census-tract-data}}
    `);

    assert.equal(this.element.textContent.trim(), '9999');
  });
});
