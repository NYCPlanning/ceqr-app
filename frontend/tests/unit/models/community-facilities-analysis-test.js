import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Model | community facilities analysis', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it correctly calculates child care impact', async function(assert) {
    const analysisMirage = server.create('community-facilities-analysis', 'childCareImpact');
    const project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'community-facilities-analysis' },
    );
    const analysis = await project.get('communityFacilitiesAnalysis');

    assert.equal(analysis.potentialChildCareImpact, true);
    assert.equal(analysis.detailedAnalysis, true);
  });

  test('it correctly calculates no child care impact', async function(assert) {
    const analysisMirage = server.create('community-facilities-analysis', 'noChildCareImpact');
    const project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'community-facilities-analysis' },
    );
    const analysis = await project.get('communityFacilitiesAnalysis');

    assert.equal(analysis.potentialChildCareImpact, false);
    assert.equal(analysis.detailedAnalysis, false);
  });

  test('it correctly calculates library impact', async function(assert) {
    const analysisMirage = server.create('community-facilities-analysis', 'libraryImpact');
    const project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'community-facilities-analysis' },
    );
    const analysis = await project.get('communityFacilitiesAnalysis');

    assert.equal(analysis.potentialLibraryImpact, true);
    assert.equal(analysis.detailedAnalysis, true);
  });

  test('it correctly calculates no library impact', async function(assert) {
    const analysisMirage = server.create('community-facilities-analysis', 'noLibraryImpact');
    const project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'community-facilities-analysis' },
    );
    const analysis = await project.get('communityFacilitiesAnalysis');

    assert.equal(analysis.potentialLibraryImpact, false);
    assert.equal(analysis.detailedAnalysis, false);
  });
});
