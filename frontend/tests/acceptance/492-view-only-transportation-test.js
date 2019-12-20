import { module, test } from 'qunit';
import { visit, fillIn, click, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | 492 view only transportation', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User can to toggle Manual Modal Splits when project is not viewOnly', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            landUse: 'residential',
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
          }),
        ],
       }),
       communityFacilitiesAnalysis: this.server.create('communityFacilitiesAnalysis'),
       viewOnly: false,
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    await click('[data-test-transportation-step="planning-factors"]');

    await assert.ok(find('[data-test-manual-mode-toggle]'));
  });

  test('User cannot toggle to Manual Modal Splits when project is viewOnly', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            landUse: 'residential',
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
          }),
        ],
       }),
       communityFacilitiesAnalysis: this.server.create('communityFacilitiesAnalysis'),
       viewOnly: true,
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    await click('[data-test-transportation-step="planning-factors"]');

    await assert.notOk(find('[data-test-manual-mode-toggle]'));
  });
});
