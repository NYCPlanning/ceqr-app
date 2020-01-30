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

  test('Projects with one land use and Sum of Ratio > 1 TRIGGERS a detailed analysis', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      totalUnits: 241,
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

  test('Projects with one land use and Sum of Ratio <= 1 DO NOT trigger a detailed analysis', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      totalUnits: 240,
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

  // TODO: Address issue #619:
  // https://github.com/NYCPlanning/ceqr-app/issues/619
  // When the SumOfRatios is barely over 1, the user interface should clarify the difference instead of
  // displaying the value rounded to 1 without explanation.
  // Perhaps there should also be a test here that checks for some clarification in the UI.
  test('Projects with multiple land uses and Sum of Ratio > 1 TRIGGERS a detailed analysis', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      totalUnits: 10,
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

  test('Projects with multiple land uses and Sum of Ratio <= 1 DO NOT trigger a detailed analysis', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      totalUnits: 10,
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
});
