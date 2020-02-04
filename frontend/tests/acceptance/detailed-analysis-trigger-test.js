import { module, test } from 'qunit';
import {
  visit,
  fillIn,
  click,
  currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | detailed analysis trigger', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('One land use and Sum of Ratio > 1 TRIGGERS a detailed analysis', async function(assert) {
    this.server.create('user');

    // Create a project with only the Residential land use by only assigning
    // non-zero value to `totalUnits`.
    // Generate a Sum of Ratio greater than 1 by assigning `totalUnits` a value
    // greater than 240, which is the Residential unit threshold for traffic
    // zone 1.
    // Sum of Ratios is essentially the average of ratios of each land use.
    // The ratio of each land use is their assigned value divided by their
    // threshold value.
    // Refer to table 16-1 in the CEQR technical manual for threshold values.
    this.server.create('project', {
      totalUnits: 241,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [],
      industrialLandUse: [],
      communityFacilityLandUse: [],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    assert.equal(currentURL(), '/project/1/transportation');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'Yes');
  });

  test('One land use and Sum of Ratio <= 1 DOES NOT in itself trigger a detailed analysis', async function(assert) {
    this.server.create('user');
    // Create a project with only the Residential land use and Sum of Ratios
    // equal to 1. See test above for an explanation of this project setup.
    this.server.create('project', {
      totalUnits: 240,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [],
      industrialLandUse: [],
      communityFacilityLandUse: [],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    assert.equal(currentURL(), '/project/1/transportation');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'No');
  });

  test('Multiple land uses and Sum of Ratio > 1 TRIGGERS a detailed analysis', async function(assert) {
    this.server.create('user');

    // Create project w/ 3 land uses: Residential, Office & Retail.
    // The project's Sum of Ratios across the three land uses is barely over 1.
    this.server.create('project', {
      totalUnits: 10,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [
        {
          type: 'office',
          grossSqFt: 72000,
        },
        {
          type: 'regional-retail',
          grossSqFt: 10000,
        },
      ],
      industrialLandUse: [],
      communityFacilityLandUse: [],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    assert.equal(currentURL(), '/project/1/transportation');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'Yes');
  });

  test('Multiple land uses and Sum of Ratio <= 1 DOES NOT in itself trigger a detailed analysis', async function(assert) {
    this.server.create('user');
    // Create a project with three land uses and Sum of Ratios barely under 1.
    this.server.create('project', {
      totalUnits: 10,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [
        {
          type: 'office',
          grossSqFt: 71000,
        },
        {
          type: 'regional-retail',
          grossSqFt: 10000,
        },
      ],
      industrialLandUse: [],
      communityFacilityLandUse: [],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    assert.equal(currentURL(), '/project/1/transportation');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'No');
  });

  test('Fast food restaurant of 2500 sqft or more TRIGGERS a detailed analysis', async function(assert) {
    this.server.create('user');
    this.server.create('project', {
      // Override factory default of 1000 totalUnits
      totalUnits: 0,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [
        {
          type: 'fast-food',
          grossSqFt: 2500,
        },
      ],
      industrialLandUse: [],
      communityFacilityLandUse: [],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    assert.equal(currentURL(), '/project/1/transportation');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'Yes');
  });

  test('Fast food restaurant UNDER 2500 sqft DOES NOT in itself trigger a detailed analysis', async function(assert) {
    this.server.create('user');
    this.server.create('project', {
      // Override factory default of 1000 totalUnits
      totalUnits: 0,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [
        {
          type: 'fast-food',
          grossSqFt: 2499,
        },
      ],
      industrialLandUse: [],
      communityFacilityLandUse: [],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    assert.equal(currentURL(), '/project/1/transportation');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'No');
  });

  test('Community facility land use DOES NOT in itself trigger a detailed analysis', async function(assert) {
    this.server.create('user');
    this.server.create('project', {
      // Override factory default of 1000 totalUnits
      totalUnits: 0,
      seniorUnits: 0,
      affordableUnits: 0,
      commercialLandUse: [],
      industrialLandUse: [],
      communityFacilityLandUse: [
        {
          name: 'General Community Facility',
          type: 'community-facility',
          grossSqFt: 2000,
        },
      ],
      parkingLandUse: [],
      transportationAnalysis: this.server.create('transportationAnalysis', {
        trafficZone: 1,
      }),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    const detailedAnalysisAnswer = this.element.querySelector('[data-test-transportation-detailed-analysis-answer]').textContent.trim();

    assert.equal(detailedAnalysisAnswer, 'No');
  });
});
