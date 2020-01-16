import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | transportation/tdf/modal-splits', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('calculates manual mode split totals correctly', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('user');
    this.server.create('data-package');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
            landUse: 'residential',
            // necessary for displaying certain elements
            // am/md/pm/saturday values (true) vs. allPeriods values (false)
            temporalModeSplits: true,
            // necessary for displaying certain elements
            // user input mode splits (true) vs. mode split values from census tract calculator (false)
            manualModeSplits: true,
          }),
        ],
      }),
    });

    // define project model
    const project = await store.findRecord('project', 1, {
      include: ['transportation-analysis,transportation-analysis.transportation-planning-factors'].join(','),
    });

    // replicating how availablePackages is defined on routes/project/show/transportation/tdf/planning-factors/show.js
    const dataPackage = project.transportationAnalysis.get('transportationPlanningFactors').firstObject.get('dataPackage');
    const availablePackages = await store.query('data-package', {
      filter: {
        package: dataPackage.get('package'),
      },
    });

    this.set('transportationPlanningFactorResidentialModel', project.transportationAnalysis.get('transportationPlanningFactors').firstObject);
    this.set('projectModel', project);
    this.set('transportationAnalysisModel', project.transportationAnalysis);
    this.set('availablePackages', availablePackages);

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=transportationAnalysisModel
        factor=transportationPlanningFactorResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
  `);

    // ##### WHEN temporalModeSplits is TRUE ##########################################################
    // if manualModeSplits is true, then modeSplits = modeSplitsFromUser, which are all default 0
    assert.equal(this.element.querySelector('[data-test-total-am]').textContent, '0', 'total am default');
    assert.equal(this.element.querySelector('[data-test-total-md]').textContent, '0', 'total md default');
    assert.equal(this.element.querySelector('[data-test-total-pm]').textContent, '0', 'total pm default');
    assert.equal(this.element.querySelector('[data-test-total-saturday]').textContent, '0', 'total saturday default');

    // USER FILLS IN MANUAL MODE SPLITS
    // total for am should be 3
    await fillIn('[data-test-modal-split-input-am="auto"]', 1);
    await fillIn('[data-test-modal-split-input-am="taxi"]', 2);

    // total for md should be 7
    await fillIn('[data-test-modal-split-input-md="bus"]', 3);
    await fillIn('[data-test-modal-split-input-md="subway"]', 4);

    // total for pm should be 11
    await fillIn('[data-test-modal-split-input-pm="railroad"]', 5);
    await fillIn('[data-test-modal-split-input-pm="auto"]', 6);

    // total for sat should be 15
    await fillIn('[data-test-modal-split-input-sat="taxi"]', 7);
    await fillIn('[data-test-modal-split-input-sat="bus"]', 8);

    // tests for total.am, total.md, total.pm, total.saturday in computed property `total`
    assert.equal(this.element.querySelector('[data-test-total-am]').textContent, '3', 'total am calculated');
    assert.equal(this.element.querySelector('[data-test-total-md]').textContent, '7', 'total md calculated');
    assert.equal(this.element.querySelector('[data-test-total-pm]').textContent, '11', 'total pm calculated');
    assert.equal(this.element.querySelector('[data-test-total-saturday]').textContent, '15', 'total saturday calculated');

    // ##### WHEN temporalModeSplits is FALSE ##########################################################
    // NOTE: clicking this button also tests the `toggleTemporalModeSplits` action
    // this action sets temporalModeSplits to false
    // switches from Temporal Splits tab to All Periods tab
    await click('[data-test-button="all periods toggle"]');

    // if manualModeSplits is true, then modeSplits = modeSplitsFromUser, which are all default 0
    assert.ok(this.element.querySelector('[data-test-total-all-periods]').textContent.includes('0'), 'total all periods default');

    // USER FILLS IN MANUAL MODE SPLITS
    // total for all periods should be 21
    await fillIn('[data-test-modal-split-input-allperiods="auto"]', 1);
    await fillIn('[data-test-modal-split-input-allperiods="taxi"]', 2);
    await fillIn('[data-test-modal-split-input-allperiods="bus"]', 3);
    await fillIn('[data-test-modal-split-input-allperiods="subway"]', 4);
    await fillIn('[data-test-modal-split-input-allperiods="railroad"]', 5);
    await fillIn('[data-test-modal-split-input-allperiods="walk"]', 6);

    // tests for total.allPeriods in computed property `total`
    assert.ok(this.element.querySelector('[data-test-total-all-periods]').textContent.includes('21'), 'total all periods calculated');
  });

  test('non-manual modal split values show up correctly', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('user');
    this.server.create('data-package');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
            landUse: 'residential',
            // necessary for displaying certain elements
            // am/md/pm/saturday values (true) vs. allPeriods values (false)
            temporalModeSplits: true,
            // necessary for displaying certain elements
            // user input mode splits (true) vs. mode split values from census tract calculator (false)
            manualModeSplits: true,
          }),
        ],
      }),
    });

    // define project model
    const project = await store.findRecord('project', 1, {
      include: ['transportation-analysis,transportation-analysis.transportation-planning-factors'].join(','),
    });

    // replicating how availablePackages is defined on routes/project/show/transportation/tdf/planning-factors/show.js
    const dataPackage = project.transportationAnalysis.get('transportationPlanningFactors').firstObject.get('dataPackage');
    const availablePackages = await store.query('data-package', {
      filter: {
        package: dataPackage.get('package'),
      },
    });

    this.set('transportationPlanningFactorResidentialModel', project.transportationAnalysis.get('transportationPlanningFactors').firstObject);
    this.set('projectModel', project);
    this.set('transportationAnalysisModel', project.transportationAnalysis);
    this.set('availablePackages', availablePackages);

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=transportationAnalysisModel
        factor=transportationPlanningFactorResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
  `);

    // sets manualModeSplits to false
    // runs action toggleCensusTractModeSplits
    await click('[data-test-button="toggle census tract mode splits"]');
    // TODO: check that server has saved

    await click('[data-test-button]');

    // sets manualModeSplits to true
    // sets seeCensusTracts to false
    // runs action toggleManualModeSplits
    await click('[data-test-button="toggle manual mode splits"]');

    // // runs toggleSeeCensusTracts
    // await click('[data-test-button="see census tracts"]');

    assert.ok(true, true);

    await this.pauseTest();
  });
});
