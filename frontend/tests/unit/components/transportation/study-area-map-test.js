import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Component | transportation/study-area-map', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it computes correct jtwStudySelectionComputed', async function(assert) {
    // if project exists with transportationAnalysis with the given study selection id arrays
    const jtwStudySelection = ['selectedGeoid1', 'selectedGeoid2'];
    const project = server.create('project');
    const model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});
    model.set('transportationAnalysis.jtwStudySelection', jtwStudySelection);

    // when the component is rendered with that project
    let component = this.owner.factoryFor('component:transportation/study-area-map').create({project: model});

    // then the component's jtwStudySelectionComputed property should include the study selection ids
    const highlightedFeatureIds = component.get('jtwStudySelectionComputed');
    assert.ok(jtwStudySelection.every(id => highlightedFeatureIds.includes(id)));
  });
});
