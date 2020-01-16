import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | transportation/tdf/modal-splits/census-tracts-map', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders and displays a BBL', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('project');
    this.server.create('transportation-analysis');

    this.project = await store.findRecord('project', 1);
    this.analysis = await store.findRecord('transportation-analysis', 1);

    await render(hbs`
      <Transportation::Tdf::ModalSplits::CensusTractsMap
        @analysis={{this.analysis}}
        @project={{this.project}}
      />
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
