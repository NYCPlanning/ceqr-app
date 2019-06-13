import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Unit | Component | transportation/study-area-map', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it computes correct highlightedFeatureIds', async function(assert) {
    // if project exists with transportationAnalysis with the given study selection id arrays
    const jtwStudySelection = ['selectedGeoid1', 'selectedGeoid2'];
    const requiredJtwStudySelection = ['requiredGeoid1', 'requiredGeoid2'];
    const project = server.create('project');
    const model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});
    model.set('transportationAnalysis.jtwStudySelection', jtwStudySelection);
    model.set('transportationAnalysis.requiredJtwStudySelection', requiredJtwStudySelection);

    // when the component is rendered with that project, and has the given hovered feature id
    let component = this.owner.factoryFor('component:transportation/study-area-map').create({analysis: model.transportationAnalysis});
    const hoveredGeoid = 'hoveredGeoid';
    component.setFirstHoveredFeatureId([{ properties: { geoid: hoveredGeoid } }])

    // then the component's highlightedFeatureIds property should include:
    const highlightedFeatureIds = component.get('highlightedFeatureIds');
    // all of the requiredJtwStudySelection ids
    assert.ok(requiredJtwStudySelection.every(id => highlightedFeatureIds.includes(id)));
    // all of the jtwStudySelection ids
    assert.ok(jtwStudySelection.every(id => highlightedFeatureIds.includes(id)));
    // the hovered id
    assert.ok(highlightedFeatureIds.includes(hoveredGeoid));
  });
});
