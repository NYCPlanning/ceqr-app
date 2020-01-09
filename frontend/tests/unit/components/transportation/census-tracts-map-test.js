import { module, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from "ember-cli-mirage/test-support";

module('Unit | Component | transportation/census-tracts-map', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  skip('it computes correct jtwStudySelectionComputed', async function(assert) {
    // if project exists with transportationAnalysis with the given study selection id arrays
    const censusTractsSelection = ['selectedGeoid1', 'selectedGeoid2'];
    const project = server.create('project');
    const model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});
    model.set('transportationAnalysis.censusTractsSelection', censusTractsSelection);

    // when the component is rendered with that project
    let component = this.owner.factoryFor('component:transportation/census-tracts-map').create({project: model});

    // then the component's jtwStudySelectionComputed property should include the study selection ids
    const completeCensusTractsSelection = component.get('completeCensusTractsSelection');
    assert.ok(censusTractsSelection.every(id => completeCensusTractsSelection.includes(id)));
  });
});
