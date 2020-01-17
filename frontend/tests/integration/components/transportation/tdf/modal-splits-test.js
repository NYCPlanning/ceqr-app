import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | transportation/tdf/modal-splits', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('temporal split totals calculate correctly when user manually inputs mode split values', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('user');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
            landUse: 'residential',
            // necessary for displaying certain elements
            // Temporal Splits tab (true) vs. All Periods tab (false)
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

    this.project = project;
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=project.transportationAnalysis
        factor=transportationPlanningFactorsResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
    `);

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
    await fillIn('[data-test-modal-split-input-saturday="taxi"]', 7);
    await fillIn('[data-test-modal-split-input-saturday="bus"]', 8);

    // tests for total.am, total.md, total.pm, total.saturday in computed property `total`
    assert.equal(this.element.querySelector('[data-test-total-am]').textContent, '3', 'total am calculated');
    assert.equal(this.element.querySelector('[data-test-total-md]').textContent, '7', 'total md calculated');
    assert.equal(this.element.querySelector('[data-test-total-pm]').textContent, '11', 'total pm calculated');
    assert.equal(this.element.querySelector('[data-test-total-saturday]').textContent, '15', 'total saturday calculated');
  });

  test('allPeriod total calculates correctly when user manually inputs mode split values', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('user');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      transportationAnalysis: this.server.create('transportationAnalysis', {
        transportationPlanningFactors: [
          this.server.create('transportationPlanningFactor', {
            dataPackage: this.server.create('dataPackage', 'nycAcs'),
            landUse: 'residential',
            // necessary for displaying certain elements
            // Temporal Splits tab (true) vs. All Periods tab (false)
            temporalModeSplits: false,
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

    this.project = project;
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=project.transportationAnalysis
        factor=transportationPlanningFactorsResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
    `);

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

  test('user can toggle between All Periods and Temporal Mode Splits', async function(assert) {
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
            // Temporal Splits tab (true) vs. All Periods tab (false)
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

    this.project = project;
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=project.transportationAnalysis
        factor=transportationPlanningFactorsResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
    `);

    // #### CHECK DEFAULT VALUES #############################################
    // check that correct elements are displayed when temporalModeSplits = true
    assert.ok('[data-test-column-title="am"]');
    // This action saves the transportationPlanningFactors object model, so check that server has correct value
    assert.equal(server.db.transportationPlanningFactors.firstObject.temporalModeSplits, true);

    // runs the action toggleTemporalModeSplits
    // sets temporalModeSplits to false
    await click('[data-test-button="all periods tab"]');

    // #### CHECK AFTER CLICKING All Periods TAB #############################################
    // check that correct elements are displayed when temporalModeSplits = false
    assert.ok('[data-test-column-title="all periods"]');
    // This action saves the transportationPlanningFactors object model, so check that server has correct value
    assert.equal(server.db.transportationPlanningFactors.firstObject.temporalModeSplits, false);

    // runs the action toggleTemporalModeSplits
    // sets temporalModeSplits to true
    await click('[data-test-button="temporal splits tab"]');

    // #### CHECK AFTER CLICKING Temporal Splits TAB #############################################
    // check that correct elements are displayed again when temporalModeSplits = true
    assert.ok('[data-test-column-title="am"');
    // This action saves the transportationPlanningFactors object model, so check that server has correct value
    assert.equal(server.db.transportationPlanningFactors.firstObject.temporalModeSplits, true);
  });
});
