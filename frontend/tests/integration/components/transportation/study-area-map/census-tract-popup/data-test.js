import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import stubReadonlyStore from '../../../../../helpers/stub-readonly-store';

module('Integration | Component | transportation/study-area-map/census-tract-popup/data', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  const modalSplit = { value: 9999 };
  stubReadonlyStore(hooks, modalSplit);

  test('it fetches data for the given geoid', async function(assert) {
    // If the data defined above is returned for given geoid
    this.geoid = '1';
    // When the template is rendered
    await render(hbs`
      {{#transportation/study-area-map/census-tract-popup/data geoid=geoid as |censusTractData|}}
        {{#censusTractData.loaded as |data|}}
            {{data.value}}
            {{data.geoid}}
        {{/censusTractData.loaded}}
      {{/transportation/study-area-map/census-tract-popup/data}}
    `);

    // Then a RecordArray containing transportation-census-estimates for that geoid will be yielded by the component
    const content = this.element.textContent.trim();
    assert.ok(content.includes(modalSplit.value), 'data does not have correct value');
    assert.ok(content.includes(this.geoid), 'data does not have correct geoid');
  });
});
