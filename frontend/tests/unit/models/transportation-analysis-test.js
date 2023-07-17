import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { association } from 'ember-cli-mirage';

module('Unit | Model | transportation analysis', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  const hasAllLandUses = {
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

  test('it correctly calculates square feet, ratios, and sum of ratios for project land use', async function (assert) {
    const analysisMirage = server.create(
      'transportation-analysis',
      hasAllLandUses
    );

    const project = await this.owner
      .lookup('service:store')
      .findRecord('project', analysisMirage.projectId, {
        include: 'transportation-analysis',
      });
    const analysis = await project.get('transportationAnalysis');

    assert.equal(analysis.residentialUnits, 1000); // project.totalUnits
    assert.equal(analysis.officeSqFt, 15); // project.commercialLandUse[2].grossSqFt (name: Office)
    assert.equal(analysis.regionalRetailSqFt, 35); // project.commercialLandUse[3].grossSqFt (name: Regional Retail)
    assert.equal(analysis.localRetailSqFt, 60); // project.commercialLandUse[4].grossSqFt (name: Local Retail)
    assert.equal(analysis.restaurantSqFt, 90); // project.commercialLandUse[0].grossSqFt + project.commercialLandUse[1].grossSqFt (name: Fast Food Restaurant, name: Restaurant (not fast food))
    assert.equal(analysis.communityFacilitySqFt, 100); // project.communityFacilityLandUse[0].grossSqFt (name: General Community Facility)
    assert.equal(analysis.offStreetParkingSpaces, 170); // project.parkingLandUse[0].spaces + project.parkingLandUse[1].spaces (name: Garages, name: Lots)

    assert.equal(analysis.residentialUnitsRatio, 5); // residentialUnitsRatio = residentialUnits / thresholdFor residentialUnits zone 2 = 1000/200
    assert.equal(analysis.officeSqFtRatio, 0.00015); // officeSqFtRatio = officeSqFt / thresholdFor officeSqFtRatio zone 2 = 15/100000
    assert.equal(analysis.regionalRetailSqFtRatio, 0.00175); // regionalRetailSqFtRatio = regionalRetailSqFt / thresholdFor regionalRetailSqFt zone 2 = 35/20000
    assert.equal(analysis.localRetailSqFtRatio, 0.004); // localRetailSqFtRatio = localRetailSqFt / thresholdFor localRetailSqFt zone 2 =  60/15000
    assert.equal(analysis.restaurantSqFtRatio, 0.0045); // restaurantSqFt Ratio = restaurantSqFt / thresholdFor restaurantSqFt zone 2 = 90/20000
    assert.equal(analysis.communityFacilitySqFtRatio, 0.004); // communityFacilitySqFtRatio = communityFacilitySqFt / thresholdFor communityFacilitySqFt zone 2 =  100/25000
    assert.equal(analysis.offStreetParkingSpacesRatio, 2); // offStreetParkingSpacesRatio = offStreetParkingSpaces / thresholdFor offStreetParkingSpaces zone 2 =  170/85

    // sumOfRatios = residentialUnitsRatio + officeSqFtRatio + regionalRetailSqFtRatio + localRetailSqFtRatio +
    // restaurantSqFtRatio + communityFacilitySqFtRatio + offStreetParkingSpacesRatio
    assert.equal(analysis.sumOfRatios, 7.014399999999999);
    assert.true(analysis.sumOfRatiosOver1); // if sumOfRatios > 1, then true
  });

  test('it correctly calculates detailedAnalysis', async function (assert) {
    // project that has fast food but does NOT have community facility or sumOfRatiosOver1
    // restaurantSqFt Ratio = restaurantSqFt / thresholdFor restaurantSqFt zone 2 = 40/20000 = 0.002
    // residentialUnitsRatio = residentialUnits / thresholdFor residentialUnits zone 2 = 2/200 = 0.01
    // sumOfRatios = 0.01 + 0.002 = 0.012 < 1; sumOfRatiosOver1 = false
    const analysisMirageFastFood = server.create('transportation-analysis', {
      trafficeZone: 2,
      project: association({
        totalUnits: 2,
        commercialLandUse: [
          {
            name: 'Fast Food Restaurant',
            type: 'fast-food',
            grossSqFt: 2500,
          },
        ],
      }),
    });

    // project that has sumOfRatiosOver1 but does NOT have community facilities or fast Food
    // offStreetParkingSpacesRatio = offStreetParkingSpaces / thresholdFor offStreetParkingSpaces zone 2 =  200/85 = 2.4
    // residentialUnitsRatio = residentialUnits / thresholdFor residentialUnits zone 2 = 2/200 = 0.01
    // sumOfRatios = 2.4 + 0.01 = 2.41 > 1; sumOfRatiosOver1 = true
    const analysisMiragesumOfRatiosOver1 = server.create(
      'transportation-analysis',
      {
        trafficeZone: 2,
        project: association({
          totalUnits: 2, // residentialUnitsRatio = residentialUnits / thresholdFor residentialUnits zone 2 = 2/200 = 0.01
          parkingLandUse: [
            {
              name: 'Lots',
              type: 'lots',
              spaces: 200,
            },
          ],
        }),
      }
    );

    // project that has NO sumOfRatiosOver1, Community Facilities or Fast Food
    // officeSqFtRatio = officeSqFt / thresholdFor officeSqFtRatio zone 2 = 15/100000 = 0.00015
    // residentialUnitsRatio = residentialUnits / thresholdFor residentialUnits zone 2 = 2/200 = 0.01
    // sumOfRatios = 0.01 + 0.00015 = 0.01015 < 1; sumOfRatiosOver1 = false
    const analysisMirageNoConditions = server.create(
      'transportation-analysis',
      {
        trafficeZone: 2,
        project: association({
          totalUnits: 2,
          commercialLandUse: [
            {
              name: 'Office',
              type: 'office',
              grossSqFt: 15,
            },
          ],
        }),
      }
    );

    // project with fast food
    const projectFastFood = await this.owner
      .lookup('service:store')
      .findRecord('project', analysisMirageFastFood.projectId, {
        include: 'transportation-analysis',
      });
    // project with sumOfRatiosOver1
    const projectsumOfRatiosOver1 = await this.owner
      .lookup('service:store')
      .findRecord('project', analysisMiragesumOfRatiosOver1.projectId, {
        include: 'transportation-analysis',
      });
    // project without fast food, community facility, or sumOfRatiosOver1
    const projectNoConditions = await this.owner
      .lookup('service:store')
      .findRecord('project', analysisMirageNoConditions.projectId, {
        include: 'transportation-analysis',
      });

    const analysisFastFood = await projectFastFood.get(
      'transportationAnalysis'
    );
    const analysisSumOfRatiosOver1 = await projectsumOfRatiosOver1.get(
      'transportationAnalysis'
    );
    const analysisNoConditions = await projectNoConditions.get(
      'transportationAnalysis'
    );

    // Fast Food
    assert.true(analysisFastFood.hasFastFoodGte2500);
    assert.true(analysisFastFood.detailedAnalysis);

    // sumOfRatiosOver1
    assert.true(analysisSumOfRatiosOver1.sumOfRatiosOver1);
    assert.true(analysisSumOfRatiosOver1.detailedAnalysis);

    // None of the above conditions
    assert.false(analysisNoConditions.hasFastFoodGte2500);
    assert.false(analysisNoConditions.sumOfRatiosOver1);
    assert.false(analysisNoConditions.detailedAnalysis);
  });
});
