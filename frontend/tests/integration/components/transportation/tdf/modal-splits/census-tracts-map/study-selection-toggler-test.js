import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from "ember-cli-mirage/test-support";

module('Integration | Component | transportation/census-tracts-map/study-selection-toggler', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  skip('it adds a selected feature geoId to the analysis model study selection', async function(assert) {
    // If a project exists with a transportation analysis
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const existingStudySelectionLength = await this.get('model.transportationAnalysis.jtwStudySelection').length;

    // When a feature with geoid = '1' is selected
    await render(hbs`
      {{transportation/census-tracts-map/study-selection-toggler analysis=model.transportationAnalysis selectedFeatureArray=selectedFeatures}}
    `);
    const geoid = '1';
    this.set('selectedFeatures', [{ properties: { geoid: geoid } }]);
    await settled();

    // Then the geoid should be added to the transportationAnalysis study selection
    const updatedStudySelection = await this.get('model.transportationAnalysis.jtwStudySelection');
    assert.equal(updatedStudySelection.length, existingStudySelectionLength + 1)
    assert.ok(updatedStudySelection.includes(geoid));
  });

  skip('it removes a selected feature geoId from the analysis model study selection', async function(assert) {
    // If a project exists with a transportation analysis with jtwStudySelection including given geoid
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const geoid = 'geoid';
    this.model.set('transportationAnalysis.jtwStudySelection', [geoid, '1', '2']);

     // When a feature with given geoid is selected
    await render(hbs`
      {{transportation/census-tracts-map/study-selection-toggler analysis=model.transportationAnalysis selectedFeatureArray=selectedFeatures}}
    `);
    this.set('selectedFeatures', [{ properties: { geoid: geoid } }]);
    await settled();

    // Then the geoid should be removed from the transportationAnalysis study selection
    const updatedStudySelection = await this.get('model.transportationAnalysis.jtwStudySelection');
    assert.equal(updatedStudySelection.length, 2)
    assert.notOk(updatedStudySelection.includes(geoid));
  });

});
