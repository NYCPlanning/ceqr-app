import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { association } from 'ember-cli-mirage';

module('Integration | Component | transportation/threshold-calculation', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  const projectWithAllLandUses = {
    trafficZone: 2,
    project: association({
      totalUnits: 1000,
      commercialLandUse: [
        {
          name: 'Fast Food Restaurant',
          type: 'fast-food',
          grossSqFt: 40,
        },
        {
          name: 'Restaurant (not fast food)',
          type: 'restaurant',
          grossSqFt: 50,
        },
        {
          name: 'Office',
          type: 'office',
          grossSqFt: 15,
        },
        {
          name: 'Regional Retail',
          type: 'regional-retail',
          grossSqFt: 35,
        },
        {
          name: 'Local Retail',
          type: 'local-retail',
          grossSqFt: 60,
        },
      ],
      communityFacilityLandUse: [
        {
          name: 'General Community Facility',
          type: 'community-facility',
          grossSqFt: 100,
        },
      ],
      parkingLandUse: [
        {
          name: 'Garages',
          type: 'garages',
          spaces: 70,
        },
        {
          name: 'Lots',
          type: 'lots',
          spaces: 100,
        },
      ],
    }),
  };

  test('it renders', async function(assert) {
    const analysisMirage = server.create('transportation-analysis', projectWithAllLandUses);

    const project = await this.owner.lookup('service:store').findRecord(
      'project', analysisMirage.projectId, { include: 'transportation-analysis' },
    );
    const analysis = await project.get('transportationAnalysis');

    this.set('transportationModel', analysis);

    await render(hbs`{{transportation/threshold-calculation analysis=transportationModel}}`);

    // sumOfRatios = residentialUnitsRatio + officeSqFtRatio + regionalRetailSqFtRatio + localRetailSqFtRatio +
    // restaurantSqFtRatio + communityFacilitySqFtRatio + offStreetParkingSpacesRatio
    // sumOfRatios = 7.014399999999999, this is rounded to 7.01 in computed property `detailedAnalysisPopupText`
    assert.ok(this.element.querySelector('[data-test-popup="detailed analysis"]').textContent.includes('7.01'));

    // ## We are testing 7 computed properties in this test that are calculated using
    // the transportation analysis model's computed property `thresholdFor`

    // officeThreshold = this.analysis.thresholdFor('officeSqFt')
    // with traffic zone being 2, this should equal 100000
    assert.ok(this.element.querySelector('[data-test-office-threshold]').textContent.includes('100000'));

    // residentialThreshold = this.analysis.thresholdFor('residentialUnits')
    // with traffic zone being 2, this should equal 200
    assert.ok(this.element.querySelector('[data-test-residential-threshold]').textContent.includes('200'));

    // regionalRetailThreshold = this.analysis.thresholdFor('regionalRetailSqFt');
    // with traffic zone being 2, this should equal 20000
    assert.ok(this.element.querySelector('[data-test-regional-retail-threshold]').textContent.includes('20000'));

    // localRetailThreshold = this.analysis.thresholdFor('localRetailSqFt');
    // with traffic zone being 2, this should equal 15000
    assert.ok(this.element.querySelector('[data-test-local-retail-threshold]').textContent.includes('15000'));

    // restaurantThreshold = this.analysis.thresholdFor('restaurantSqFt');
    // with traffic zone being 2, this should equal 20000
    assert.ok(this.element.querySelector('[data-test-restaurant-threshold]').textContent.includes('20000'));

    // communityFacilityThreshold = this.analysis.thresholdFor('communityFacilitySqFt');
    // with traffic zone being 2, this should equal 25000
    assert.ok(this.element.querySelector('[data-test-community-facility-threshold]').textContent.includes('25000'));

    // offStreetParkingThreshold = this.analysis.thresholdFor('offStreetParkingSpaces');
    // with traffic zone being 2, this should equal 85
    assert.ok(this.element.querySelector('[data-test-off-street-parking-threshold]').textContent.includes('85'));
  });
});
