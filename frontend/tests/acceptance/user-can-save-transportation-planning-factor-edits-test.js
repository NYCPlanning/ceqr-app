import { module, test, skip } from 'qunit';
import { visit, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | user can save transportation planning factor edits', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('User can save changes made to transportation planning factors', async function(assert) {
    this.server.create('user');
    this.server.create('project', {
      commercialLandUse: [
        {
          name: 'Office',
          type: 'office',
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

    await this.pauseTest();

    // ###### RESIDENTIAL TAB ############################
    // this checks that the correct elements are showing up, and that the user is currently on the RESIDENTIAL TAB
    assert.equal(this.element.querySelector('[data-test-total-per="residential"]').textContent, 'Total (Per 1 DU)');

    // fill in the "am" section of the in-out-splits to 13
    await fillIn('[data-test-in-out-split="in"]', 13);

    // checking that first object in factors has landUse "residential"
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.landUse, 'residential');
    // checking that last object in factors has landUse "office"
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.landUse, 'office');

    // NOTE: before we save to the model, inOutSplits, truckInOutSplits, modeSplitsFromUser, and vehicleOccupancyFromUser
    // do not exist on this.sever.db. The default values are only in the frontend so a "save" is necessary to have these attributes on the server
    // save to the model, this should only change residential value because currently on residential tab
    await click('[data-test-button="saveFactors"]');

    // ###### OFFICE TAB ############################
    // switch to office tab
    await click('[data-test-land-use-tab="office"]');

    // office inOutSplit value -- should NOT have changed, not currently on office tab
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 50);

    // this checks that the correct elements are showing up once the user has clicked the office tab
    assert.equal(this.element.querySelector('[data-test-total-per="office"]').textContent, 'Total (Per 1000 sq ft)');

    // fill in the "am" section of the in-out-splits to 29
    await fillIn('[data-test-in-out-split="in"]', 29);

    // save to the model, this should only change office value because we are currently on the office tab
    await click('[data-test-button="saveFactors"]');

    // CHECK THAT CHANGING VALUE ON OFFICE TAB, THEN SWITCHING TO RESIDENTIAL TAB,
    // THEN CLICKING SAVE BUTTON SAVES BOTH OBJECTS CORRECTLY
    await fillIn('[data-test-in-out-split="in"]', 38);
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 29);
    // "out" value should be 100 minus "in" value
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.out, 71);
    await click('[data-test-land-use-tab="residential"]');
    await click('[data-test-button="saveFactors"]');
    assert.equal(this.server.db.transportationPlanningFactors.lastObject.inOutSplits.am.in, 38);
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.in, 13);
    // "out" value should be 100 minus "in" value
    assert.equal(this.server.db.transportationPlanningFactors.firstObject.inOutSplits.am.out, 87);
  });

  skip('User can save changes made to transportation Trip Results notes', async function(assert) {
    this.server.create('user');
    this.server.create('project', {
      commercialLandUse: [
        {
          name: 'Office',
          type: 'office',
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

    await click('[data-test-transportation-step="trip-results"]');

    await click('[data-test-button="add note"]');

    await fillIn('[data-test-text-area="table note"]', 'peaches & cream');

    await click('[data-test-button="save note"]');

    assert.equal(this.element.querySelector('[data-test-text="table note"]').textContent, 'peaches & cream');

    assert.equal(this.server.db.transportationPlanningFactors.firstObject.tableNotes.personTrips, 'peaches & cream');
  });
});
