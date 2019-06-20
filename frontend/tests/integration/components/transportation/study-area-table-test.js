import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import stubReadonlyStore from '../../../helpers/stub-readonly-store';

module('Integration | Component | transportation/study-area-table', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  stubReadonlyStore(hooks);

  test('it displays a table with columns for all selected census tracts', async function(assert) {
    // If a project exists with transportation analysis with jtwStudySelection and requiredJtwStudySelection
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const selectedGeoids = ['1', '2'];
    this.model.set('transportationAnalysis.jtwStudySelection', selectedGeoids);
    const requiredGeoids = ['3', '4'];
    this.model.set('transportationAnalysis.requiredJtwStudySelection', requiredGeoids);

    // When the table is rendered with the transportation analysis
    await render(hbs`{{transportation/study-area-table analysis=model.transportationAnalysis}}`);

    // Then the table will have # of columns = # of required geoids + # of selected geoids + 2
    // (one for titles column, and one for 'Total' aggregate values column)
    assert.equal(findAll('th').length, selectedGeoids.length + requiredGeoids.length + 2);
  });

  test('it has rows with numbers, an empty title row, and rows with percents', async function(assert) {
    // If a project exists with transportation analysis with requiredJtwStudySelection
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const requiredGeoids = ['3'];
    this.model.set('transportationAnalysis.requiredJtwStudySelection', requiredGeoids);

    // When the table is rendered with the transportation analysis
    await render(hbs`{{transportation/study-area-table analysis=model.transportationAnalysis}}`);

    // Then the table will have rows with numeric values, followed by a row with no data (modal splits title row),
    // followed by rows with numeric percent values, with columns for the census tract and the aggregate totals
    const table = find('tbody');
    let foundTitleRow = false;
    for (let i = 0; i < table.rows.length; i++) {
      if(!table.rows[i].cells.length) {
        foundTitleRow = true;
        assert.equal(table.rows[i].textContent.trim(), 'Modal Splits (of total commuters):');
      } else {
        const censusTractCell = table.rows[i].cells[1];
        const match = foundTitleRow ? /\d+\.\d\s%/ : /\d+/;
        assert.ok(censusTractCell.textContent.match(match));
      }
    } 
    assert.ok(foundTitleRow);
  });

});
