import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { findAll, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { landUseColors } from 'labs-ceqr/layer-styles/land-use';
import { transitZoneColors } from 'labs-ceqr/layer-styles/transit-zone';

module('Integration | Component | transportation/tdf/modal-splits/census-tracts-map/features', function(hooks) {
  setupRenderingTest(hooks);

  test('it has default legend and unchecked boxed when flags are flase', async function(assert) {
    // If default (false) show land-use and show transit-zone flags are used
    // When the component is rendered
    await render(hbs`{{transportation/tdf/modal-splits/census-tracts-map/features }}`);

    // Then the checkboxes are not checked
    assert.notOk(find('[data-test-tz-checkbox] .checked'));
    assert.notOk(find('[data-text-lu-checkbox] .checked'));

    // And the default items are displayed
    assert.equal(findAll('[data-test-default-legend-item]').length, 3);

    // And the transit zone and lande use items are not displayed
    assert.equal(findAll('[data-test-tz-legend-item]').length, 0);
    assert.equal(findAll('[data-test-lu-legend-item]').length, 0);
  });

  test('it has populated legend and checked boxed when flags are true', async function(assert) {
    // If show land-use and show transit-zone flags are true
    this.showLU = true;
    this.showTZ = true;

    // When the component is rendered
    await render(hbs`{{transportation/tdf/modal-splits/census-tracts-map/features showLandUse=showLU showTransitZones=showTZ}}`);

    // Then the checkboxes are checked
    assert.ok(find('[data-test-tz-checkbox] .checked'));
    assert.ok(find('[data-test-lu-checkbox] .checked'));
    // And the legend items are displayed
    assert.equal(findAll('[data-test-tz-legend-item]').length, Object.keys(transitZoneColors).length);
    assert.equal(findAll('[data-test-lu-legend-item]').length, Object.keys(landUseColors).length);
  });

});
