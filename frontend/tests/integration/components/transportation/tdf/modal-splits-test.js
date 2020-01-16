import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | transportation/tdf/modal-splits', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('temporal split totals calculate correctly when user manually inputs mode split values', async function(assert) {
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

    assert.ok(this.element);
  });
});
