import { module, test } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | 487 user can save transportation planning factor edits', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User can save changes made to transportation planning factors', async function(assert) {
    server.logging = true;

    this.server.create('user');
    this.server.create('project', {
      commercialLandUse: [
        {
          name: "Office",
          type: "office",
          grossSqFt: 100,
        },
      ],
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
            landUse: 'residential',
          }),
          this.server.create('transportationPlanningFactor', {
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
            landUse: 'office',
          }),
        ],
       }),
       communityFacilitiesAnalysis: this.server.create('communityFacilitiesAnalysis'),
    });

    await visit('/');
    await fillIn('[data-test-login-form="email"]', 'user@email.com');
    await fillIn('[data-test-login-form="password"]', 'password');
    await click('[data-test-login-form="login"]');

    await click('[data-test-project="1"]');

    await click('[data-test-chapter="transportation"]');

    await click('[data-test-transportation-step="planning-factors"]');

    // ###### RESIDENTIAL TAB ############################
    // this checks that the correct elements are showing up, and that the user is currently on the RESIDENTIAL TAB
    assert.equal(this.element.querySelector('[data-test-total-per="residential"]').textContent, 'Total (Per 1 DU)');

    // fill in the "am" section of the in-out-splits to 13
    await fillIn('[data-test-in-out-split="in"]', 13);

    // checking that first object in factors has landUse "residential"
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.landUse, 'residential');
    // checking that last object in factors has landUse "office"
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.landUse, 'office');

    // residential inOutSplit value -- should NOT have changed, currently on residential tab BUT user has not clicked save yet
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.in, 50);
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.out, 50);
    // office inOutSplit value -- should NOT have changed, not currently on office tab
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 50);
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.out, 50);

    // save to the model, this should only change residential value because currently on residential tab
    await click('[data-test-button="saveFactors"]');

    // residential inOutSplit value -- SHOULD HAVE changed
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.in, 13);
    // "out" value should be 100 minus "in" value
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.out, 87);
    // office inOutSplit value -- should NOT have changed, not currently on office tab
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 50);

    // ###### OFFICE TAB ############################
    // switch to office tab
    await click('[data-test-land-use-tab="office"]');

    // this checks that the correct elements are showing up once the user has clicked the office tab
    assert.equal(this.element.querySelector('[data-test-total-per="office"]').textContent, 'Total (Per 1000 sq ft)');

    // fill in the "am" section of the in-out-splits to 29
    await fillIn('[data-test-in-out-split="in"]', 29);

    // residential inOutSplit value -- should NOT have changed, not currently on residential tab
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.in, 13);
    // office inOutSplit value -- should NOT have changed, currently on office tab BUT user has not clicked save yet
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 50);

    // save to the model, this should only change office value because we are currently on the office tab
    await click('[data-test-button="saveFactors"]');

    // residential value -- should NOT have changed, not currently on residential tab
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.in, 13);
    // office value -- SHOULD HAVE changed
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 29);
    // "out" value should be 100 minus "in" value
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.out, 71);
  });
});
