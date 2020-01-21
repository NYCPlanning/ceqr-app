import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | transportation/data-source-toggle', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.isRJTW = false;
    this.falseLabel = 'Journey To Work';
    this.trueLabel = 'Journey To Work';

    await render(hbs`{{transportation/data-source-toggle
      switch=this.isRJTW
      falseLabel=this.falseLabel
      trueLabel=this.trueLabel
    }}`);
  });

  test('it toggles the switch and indicates its state', async function(assert) {
    // get refs to Journey To Work and Reverse Journey To Work buttons.
    const jtwButton = find('[data-test-censustracts-table-isrjtw="false"]');
    const rjtwButton = find('[data-test-censustracts-table-isrjtw="true"]');

    // Table is in JTW mode on load
    assert.dom(jtwButton).hasClass('active');
    assert.dom(rjtwButton).hasNoClass('active');

    // Table switches to RJTW mode after clicking RJTW button
    await click("[data-test-censustracts-table-isrjtw='true']");

    assert.dom(jtwButton).hasNoClass('active');
    assert.dom(rjtwButton).hasClass('active');

    // Table switches back to JTW mode after clicking JTW button
    await click("[data-test-censustracts-table-isrjtw='false']");

    assert.dom(jtwButton).hasClass('active');
    assert.dom(rjtwButton).hasNoClass('active');
  });
});
