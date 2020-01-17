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
      include: 'transportation-analysis,transportation-analysis.transportation-planning-factors',
    });

    // replicating how availablePackages is defined on routes/project/show/transportation/tdf/planning-factors/show.js
    const dataPackage = project.transportationAnalysis.get('transportationPlanningFactors').firstObject.get('dataPackage');
    const availablePackages = await store.query('data-package', {
      filter: {
        package: dataPackage.get('package'),
      },
    });

    this.project = project;
    this.analysis = await project.get('transportationAnalysis');
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=analysis
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
      include: 'transportation-analysis,transportation-analysis.transportation-planning-factors',
    });

    // replicating how availablePackages is defined on routes/project/show/transportation/tdf/planning-factors/show.js
    const dataPackage = project.transportationAnalysis.get('transportationPlanningFactors').firstObject.get('dataPackage');
    const availablePackages = await store.query('data-package', {
      filter: {
        package: dataPackage.get('package'),
      },
    });

    this.project = project;
    this.analysis = await project.get('transportationAnalysis');
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=analysis
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
      include: 'transportation-analysis,transportation-analysis.transportation-planning-factors',
    });

    // replicating how availablePackages is defined on routes/project/show/transportation/tdf/planning-factors/show.js
    const dataPackage = project.transportationAnalysis.get('transportationPlanningFactors').firstObject.get('dataPackage');
    const availablePackages = await store.query('data-package', {
      filter: {
        package: dataPackage.get('package'),
      },
    });

    this.project = project;
    this.analysis = await project.get('transportationAnalysis');
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=analysis
        factor=transportationPlanningFactorsResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
    `);

    // #### CHECK DEFAULT VALUES #############################################
    // check that correct elements are displayed when temporalModeSplits = true
    assert.ok(this.element.querySelector('[data-test-column-title="am"]'));
    assert.notOk(this.element.querySelector('[data-test-column-title="all periods"]'));

    // runs the action toggleTemporalModeSplits
    // sets temporalModeSplits to false
    await click('[data-test-button="all periods tab"]');

    // #### CHECK AFTER CLICKING All Periods TAB #############################################
    // check that correct elements are displayed when temporalModeSplits = false
    assert.ok(this.element.querySelector('[data-test-column-title="all periods"]'));
    assert.notOk(this.element.querySelector('[data-test-column-title="am"]'));

    // runs the action toggleTemporalModeSplits
    // sets temporalModeSplits to true
    await click('[data-test-button="temporal splits tab"]');

    // #### CHECK AFTER CLICKING Temporal Splits TAB #############################################
    // check that correct elements are displayed again when temporalModeSplits = true
    assert.ok(this.element.querySelector('[data-test-column-title="am"]'));
    assert.notOk(this.element.querySelector('[data-test-column-title="all periods"]'));
  });

  test('user can toggle between Manual and Census Tracts tabs', async function(assert) {
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
      include: 'transportation-analysis,transportation-analysis.transportation-planning-factors',
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
    // check that correct elements are displayed when manualModeSplits = true
    assert.ok(this.element.querySelector('[data-test-modal-split-input-am="auto"]'));
    assert.notOk(this.element.querySelector('[data-test-all-period-percent-value="auto"]'));

    // runs the action toggleCensusTractModeSplits
    // sets manualModeSplits to false
    await click('[data-test-button="census tracts tab"]');

    // #### CHECK AFTER CLICKING Census Tracts TAB #############################################
    // check that correct elements are displayed when manualModeSplits = false
    assert.ok(this.element.querySelector('[data-test-all-period-percent-value="auto"]'));
    assert.notOk(this.element.querySelector('[data-test-modal-split-input-am="auto"]'));

    // runs the action toggleManualModeSplits
    // sets manualModeSplits to true
    await click('[data-test-button="manual tab"]');

    // #### CHECK AFTER CLICKING Manual TAB #############################################
    // check that correct elements are displayed again when manualModeSplits = true
    assert.ok(this.element.querySelector('[data-test-modal-split-input-am="auto"]'));
    assert.notOk(this.element.querySelector('[data-test-all-period-percent-value="auto"]'));
  });

  test('user can toggle Edit Mode and add/remove modes from the displayed rows', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('user');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      communityFacilitiesAnalysis: this.server.create('communityFacilitiesAnalysis'),
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
    this.analysis = await project.get('transportationAnalysis');
    this.transportationPlanningFactorsResidentialModel = project.get('transportationAnalysis').get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=analysis
        factor=transportationPlanningFactorsResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
    `);

    // check that taxi is included in modes list and ferry is not
    assert.ok(this.element.querySelector('[data-test-row-mode-title="taxi"]'), 'row title includes taxi before edit');
    assert.notOk(this.element.querySelector('[data-test-row-mode-title="ferry"]'), 'row title does not include ferry before edit');

    // enter edit mode where a user can add or remove transportation modes
    await click('[data-test-button="enter edit mode"]');

    // ##### REMOVE AN ITEM FROM THE ACTIVE LIST ##################################
    // check that the taxi mode item is now displayed in the active modes section
    assert.ok(this.element.querySelector('[data-test-active-mode="taxi"]'), 'taxi in active mode');

    // click on the taxi checkbox to remove it from the active modes
    await click('[data-test-checkbox="taxi"]');

    // check that the taxi mode item is now displayed in the inactive modes section
    assert.ok(this.element.querySelector('[data-test-inactive-mode="taxi"]'), 'taxi in inactive mode');

    // ##### ADD AN ITEM TO THE ACTIVE LIST ##################################
    // check that the ferry mode item is now displayed in the inactive modes section
    assert.ok(this.element.querySelector('[data-test-inactive-mode="ferry"]'), 'ferry in inactive mode');

    // click on the ferry checkbox to add it to the active modes
    await click('[data-test-checkbox="ferry"]');

    // check that the ferry mode item is now displayed in the active modes section
    assert.ok(this.element.querySelector('[data-test-active-mode="ferry"]'), 'ferry in active mode');

    // exit the edit mode
    await click('[data-test-button="exit edit mode"]');

    // check that ferry is now included in main list and taxi is not
    assert.ok(this.element.querySelector('[data-test-row-mode-title="ferry"]'), 'row title includes ferry after edit');
    assert.notOk(this.element.querySelector('[data-test-row-mode-title="taxi"]'), 'row title does not include taxi after edit');
  });

  test('user can remove census tracts', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('user');
    this.server.create('project', {
      publicSchoolsAnalysis: this.server.create('publicSchoolsAnalysis'),
      communityFacilitiesAnalysis: this.server.create('communityFacilitiesAnalysis'),
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
            manualModeSplits: false,
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
    this.analysis = await project.get('transportationAnalysis');
    this.transportationPlanningFactorsResidentialModel = project.transportationAnalysis.get('transportationPlanningFactors').firstObject;
    this.availablePackages = availablePackages;

    await render(hbs`
      {{#transportation/tdf/modal-splits
        project=project
        analysis=analysis
        factor=transportationPlanningFactorsResidentialModel
        availablePackages=availablePackages}}
      {{/transportation/tdf/modal-splits}}
    `);

    await click('[data-test-census-tracts-table-tab]');

    assert.ok(this.element.querySelector('[data-test-census-tract="205"]'));

    await click('[data-test-census-tract-delete]');

    assert.notOk(this.element.querySelector('[data-test-census-tract="205"]'));
  });
});
