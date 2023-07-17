import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | mapbox/layer-registry', function (hooks) {
  setupRenderingTest(hooks);

  test('it registers', async function (assert) {
    let registry = [];
    this.handleUpdatedRegistry = function (updatedRegistry) {
      registry = updatedRegistry;
    };

    // Template block usage:
    await render(hbs`
      {{#mapbox/layer-registry didUpdateLayersRegistry=(action this.handleUpdatedRegistry) as |registry|}}
        <div class="register" {{action registry.registerLayer (hash)}}>
        </div>
        <div class="unregister" {{action registry.unregisterLayer (hash)}}>
        </div>
      {{/mapbox/layer-registry}}
    `);

    await click('.register');
    await click('.register');
    await click('.register');

    assert.equal(registry.length, 3);
  });

  test('it unregisters', async function (assert) {
    let registry = [];
    this.handleUpdatedRegistry = function (updatedRegistry) {
      registry = updatedRegistry;
    };

    this.someHash = {};
    // Template block usage:
    await render(hbs`
      {{#mapbox/layer-registry didUpdateLayersRegistry=(action this.handleUpdatedRegistry) as |registry|}}
        <div class="register" {{action registry.registerLayer this.someHash}}>
        </div>
        <div class="unregister" {{action registry.unregisterLayer this.someHash}}>
        </div>
      {{/mapbox/layer-registry}}
    `);

    await click('.register');
    await click('.unregister');

    assert.equal(registry.length, 0);
  });

  test('it ignores duplicates', async function (assert) {
    let registry = [];
    this.handleUpdatedRegistry = function (updatedRegistry) {
      registry = updatedRegistry;
    };

    this.someHash = {};
    // Template block usage:
    await render(hbs`
      {{#mapbox/layer-registry didUpdateLayersRegistry=(action this.handleUpdatedRegistry) as |registry|}}
        <div class="register" {{action registry.registerLayer this.someHash}}>
        </div>
        <div class="unregister" {{action registry.unregisterLayer this.someHash}}>
        </div>
      {{/mapbox/layer-registry}}
    `);

    await click('.register');
    await click('.register');
    await click('.register');

    assert.equal(registry.length, 1);
  });
});
