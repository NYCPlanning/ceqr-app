import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | transportation/study-area-map/census-tract-popup/data', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it fetches data for the given geoid', async function(assert) {
    // If a census-tract record exists for geoid
    const geoid = '1';
    this.geoid = geoid;
    const value = 9999;
    this.server.create('census-tract', { value, geoid });

    // When the template is rendered with that geoid
    await render(hbs`
      {{#transportation/study-area-map/census-tract-popup/data geoid=geoid as |censusTractData|}}
        {{#censusTractData.loaded as |data|}}
          {{#each data as |d|}}
            {{d.geoid}}
            {{d.value}}
          {{/each}}
        {{/censusTractData.loaded}}
      {{/transportation/study-area-map/census-tract-popup/data}}
    `);

    // Then a RecordArray containing census-tracts for that geoid will be yielded by the component
    const content = this.element.textContent.trim();
    assert.ok(content.includes(geoid));
    assert.ok(content.includes(value));
  });
});
