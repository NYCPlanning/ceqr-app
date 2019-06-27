import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import stubReadonlyStore from '../../../helpers/stub-readonly-store';
import { VARIABLE_MODE_LOOKUP, COMMUTER_VARIABLES } from '../../../../utils/modalSplit';

module('Integration | Component | transportation/census-tracts-table', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  stubReadonlyStore(hooks);

  test('it toggles between JTW and RJTW', async function(assert) {
    // Set up table with simple data
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const requiredGeoids = ['3'];
    this.model.set('transportationAnalysis.requiredJtwStudySelection', requiredGeoids);

    await render(hbs`{{transportation/census-tracts-table analysis=model.transportationAnalysis}}`);

    // get refs to Journey To Work and Reverse Journey To Work buttons.
    let jtwButton  = find('[data-test-censustracts-table-isrjtw="false"]');
    let rjtwButton = find('[data-test-censustracts-table-isrjtw="true"]');
    
    // get ref to row displaying base unit values and percents
    let baseUnitModeRow = find('[data-test-censustracts-table-baseunit]');

    // Table is in JTW mode on load
    assert.equal(jtwButton.classList.contains('active'), true);
    assert.equal(rjtwButton.classList.contains('active'), false);
    assert.equal(baseUnitModeRow.querySelector('td:first-child').textContent.includes('Population'), true);
    assert.equal(baseUnitModeRow.querySelector('td:first-child').textContent.includes('Workers'), false);

    // Table switches to RJTW mode after clicking RJTW button
    await click("[data-test-censustracts-table-isrjtw='true']");

    assert.equal(jtwButton.classList.contains('active'), false);
    assert.equal(rjtwButton.classList.contains('active'), true);
    assert.equal(baseUnitModeRow.querySelector('td:first-child').textContent.includes('Population'), false);
    assert.equal(baseUnitModeRow.querySelector('td:first-child').textContent.includes('Workers'), true);

    // Table switches back to JTW mode after clicking JTW button
    await click("[data-test-censustracts-table-isrjtw='false']");

    assert.equal(jtwButton.classList.contains('active'), true);
    assert.equal(rjtwButton.classList.contains('active'), false);
    assert.equal(baseUnitModeRow.querySelector('td:first-child').textContent.includes('Population'), true);
    assert.equal(baseUnitModeRow.querySelector('td:first-child').textContent.includes('Workers'), false);
  });

  test('it displays a table with columns and subcolumns for all selected census tracts', async function(assert) {
    // If a project exists with transportation analysis with jtwStudySelection and requiredJtwStudySelection
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const selectedGeoids = ['1', '2'];
    this.model.set('transportationAnalysis.jtwStudySelection', selectedGeoids);
    const requiredGeoids = ['3', '4'];
    this.model.set('transportationAnalysis.requiredJtwStudySelection', requiredGeoids);

    // When the table is rendered with the transportation analysis
    await render(hbs`{{transportation/census-tracts-table analysis=model.transportationAnalysis}}`);

    // Then the table will have # of top level headers = # of required geoids + # of selected geoids + 2
    // (one for titles column, and one for 'Total' aggregate values column)
    let tableHead = find('thead');
    assert.equal(tableHead.querySelectorAll(':scope > tr:first-child > th').length, selectedGeoids.length + requiredGeoids.length + 2);

    // and the table will have two subheaders for each census-tract column.
    // i.e. # of sub-headers equals # top level headers + (2 * (# required geoids + # selected geoidsd)) + 1 for title + 2 for total column)
    assert.equal(tableHead.querySelectorAll(':scope > tr:nth-child(2) > th').length, 2 * (selectedGeoids.length + requiredGeoids.length) + 1 + 2);

  });

  test('it displays table with rows for transportation modes, each row displaying a count and a percent for each census tract column', async function(assert) {
    // If a project exists with transportation analysis with requiredJtwStudySelection
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const requiredGeoids = ['3'];
    this.model.set('transportationAnalysis.requiredJtwStudySelection', requiredGeoids);

    // When the table is rendered with the transportation analysis
    await render(hbs`{{transportation/census-tracts-table analysis=model.transportationAnalysis}}`);

    const table = find('tbody');

    // Then the table will have rows for each transportation mode.
    // Following mode-specific rows, the last four rows are Total, Total without work from home, Population/Worker, and Vehicle Occupancy.
    assert.ok(table.rows.length == COMMUTER_VARIABLES.length + 4);
    
    for (let i = 0; i < table.rows.length; i++) {
        const modeLabelCell = table.rows[i].cells[0];
        // Each mode row has a title column with text corresponding to the respective human-readable mode label
        if(i < table.rows.length - 4){
          assert.ok(modeLabelCell.textContent.includes(VARIABLE_MODE_LOOKUP[COMMUTER_VARIABLES[i]]));
        }

        // Each row will have pairs of columns for each census tract, one for Count and one for Percent.
        const modeCountCell = table.rows[i].cells[1];
        const countCellFormat = /\d+/;
        assert.ok(modeCountCell.textContent.match(countCellFormat));

        const modePercentCell = table.rows[i].cells[2];
        // Vehicle Occupancy row, the last row, has "-" for percent 
        const percentCellFormat = (i == table.rows.length - 1) ? /-/ : /\d+\.\d\s%/;
        assert.ok(modePercentCell.textContent.match(percentCellFormat));
    }

  });

});
