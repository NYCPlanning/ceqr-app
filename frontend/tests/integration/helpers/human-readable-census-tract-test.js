import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import stubReadonlyStore from '../../helpers/stub-readonly-store';

module('Integration | Helper | human-readable-census-tract', function(hooks) {
  setupRenderingTest(hooks);
  stubReadonlyStore(hooks);

  test('it formats a geoid as a human-readable census tract for all counties', async function(assert) {
    const state = '36';
    const censusTract = '111111';

    // Bronx County 
    this.set('bronxGeoid', `${state}005${censusTract}`);
    await render(hbs`{{human-readable-census-tract bronxGeoid}}`);
    assert.equal(this.element.textContent.trim(), `Census Tract ${censusTract}, Bronx County, New York`);

    // Queen's County 
    this.set('queensGeoid', `${state}047${censusTract}`);
    await render(hbs`{{human-readable-census-tract queensGeoid}}`);
    assert.equal(this.element.textContent.trim(), `Census Tract ${censusTract}, Queen's County, New York`);

    // New York County 
    this.set('newYorkGeoid', `${state}061${censusTract}`);
    await render(hbs`{{human-readable-census-tract newYorkGeoid}}`);
    assert.equal(this.element.textContent.trim(), `Census Tract ${censusTract}, New York County, New York`);

    // King's County
    this.set('kingsGeoid', `${state}081${censusTract}`);
    await render(hbs`{{human-readable-census-tract kingsGeoid}}`);
    assert.equal(this.element.textContent.trim(), `Census Tract ${censusTract}, King's County, New York`);

    // Richmond County
    this.set('richmondGeoid', `${state}085${censusTract}`);
    await render(hbs`{{human-readable-census-tract richmondGeoid}}`);
    assert.equal(this.element.textContent.trim(), `Census Tract ${censusTract}, Richmond County, New York`);
  });
});
