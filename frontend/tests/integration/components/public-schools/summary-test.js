import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | public-schools/summary', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('public-schools-analysis', { id: 1 });
    this.analysis = await store.findRecord('public-schools-analysis', 1);

    await render(hbs`
      <PublicSchools::Summary
        @analysis={{this.analysis}}
      />
    `);

    assert.ok(this.element);
  });
});
