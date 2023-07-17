import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | project/project-area-selector',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<Project::ProjectAreaSelector />`);

      assert.ok(this.element);

      // Template block usage:
      await render(hbs`
      <Project::ProjectAreaSelector>
        template block text
      </Project::ProjectAreaSelector>
    `);

      assert.ok(this.element);
    });
  }
);
