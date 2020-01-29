import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import stubReadonlyStore from '../../../helpers/stub-readonly-store';
import { VARIABLE_MODE_LOOKUP, COMMUTER_VARIABLES } from '../../../../utils/modalSplit';

module('Integration | Component | transportation/census-tracts-table', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  stubReadonlyStore(hooks);

  hooks.beforeEach(async function() {
    this.stubSelectedCensusTractIds = ['1', '2'];
    this.stubSelectedCensusTractData = [
      {
        trans_commuter_total: {
          geoid: 1,
          variable: 'trans_commuter_total',
          value: 10,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_commuter_total,
        },
        trans_auto_total: {
          geoid: 1,
          variable: 'trans_auto_total',
          value: 1,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_auto_total,
        },
        trans_taxi: {
          geoid: 1,
          variable: 'trans_taxi',
          value: 2,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_taxi,
        },
        trans_public_bus: {
          geoid: 1,
          variable: 'trans_public_bus',
          value: 3,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_public_bus,
        },
        trans_public_subway: {
          geoid: 1,
          variable: 'trans_public_subway',
          value: 4,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_public_subway,
        },
        trans_walk: {
          geoid: 1,
          variable: 'trans_walk',
          value: 5,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_walk,
        },
        vehicle_occupancy: {
          geoid: 1,
          variable: 'vehicle_occupancy',
          value: 6,
          moe: null,
          mode: VARIABLE_MODE_LOOKUP.vehicle_occupancy,
        },
      },
      {
        trans_commuter_total: {
          geoid: 2,
          variable: 'trans_commuter_total',
          value: 20,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_commuter_total,
        },
        trans_auto_total: {
          geoid: 2,
          variable: 'trans_auto_total',
          value: 21,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_auto_total,
        },
        trans_taxi: {
          geoid: 2,
          variable: 'trans_taxi',
          value: 3,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_taxi,
        },
        trans_public_bus: {
          geoid: 2,
          variable: 'trans_public_bus',
          value: 4,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_public_bus,
        },
        trans_public_subway: {
          geoid: 2,
          variable: 'trans_public_subway',
          value: 5,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_public_subway,
        },
        trans_walk: {
          geoid: 2,
          variable: 'trans_walk',
          value: 6,
          moe: 1,
          mode: VARIABLE_MODE_LOOKUP.trans_walk,
        },
        vehicle_occupancy: {
          geoid: 2,
          variable: 'vehicle_occupancy',
          value: 7,
          moe: null,
          mode: VARIABLE_MODE_LOOKUP.vehicle_occupancy,
        },
      },
    ];
    this.modeLookup = VARIABLE_MODE_LOOKUP;
    this.commuterModes = COMMUTER_VARIABLES;
    this.isRJTW = false;

    await render(hbs`{{transportation/census-tracts-table
      isRJTW=this.isRJTW
      selectedCensusTractIds=this.stubSelectedCensusTractIds
      selectedCensusTractData=this.stubSelectedCensusTractData
      modeLookup=this.modeLookup
      commuterModes=this.commuterModes
    }}`);
  });


  skip('it displays a table with columns and subcolumns for all selected census tracts', async function(assert) {
    // Table will have # of top level headers = # of required geoids + # of selected geoids + 2
    // (one for titles column, and one for 'Total' aggregate values column)
    const tableHead = find('thead');
    assert.equal(tableHead.querySelectorAll(':scope > tr:first-child > th').length, this.stubSelectedCensusTractIds.length + 2);

    // and the table will have two subheaders for each census-tract column.
    // i.e. # of sub-headers equals # top level headers + (2 * (# required geoids + # selected geoidsd)) + 1 for title + 2 for total column)
    assert.equal(tableHead.querySelectorAll(':scope > tr:nth-child(2) > th').length, 2 * this.stubSelectedCensusTractIds.length + 2);
  });

  skip('it displays table with rows for transportation modes, each row displaying a count and a percent for each census tract column', async function(assert) {
    const table = find('tbody');

    // Then the table will have rows for each transportation mode.
    // Following mode-specific rows, there the last five rows are Total, Total without work from home, Population/Worker,
    // a "header" row for Vehicle Occupancy, and Vehicle Occupancy.
    assert.ok(table.rows.length === COMMUTER_VARIABLES.length + 1 + 4);

    for (let i = 0; i < table.rows.length; i++) {
      const modeLabelCell = table.rows[i].cells[0];
      // Each mode row has a title column with text corresponding to the respective human-readable mode label
      if (i < table.rows.length - 5) {
        assert.ok(modeLabelCell.textContent.includes(VARIABLE_MODE_LOOKUP[COMMUTER_VARIABLES[i]]));
      }

      // There should be a header row for Average Vehicle Occupancy
      if (i === table.rows.length - 2) {
        assert.ok(table.rows[i].cells[1].textContent.includes('Average'));
      } else {
        // Except for the Average Vehicle Occupancy header row...
        // Each row will have pairs of columns for each census tract, one for Count and one for Percent.
        const modeCountCell = table.rows[i].cells[1];
        const countCellFormat = /\d+/;
        assert.ok(modeCountCell.textContent.match(countCellFormat));

        const modePercentCell = table.rows[i].cells[2];
        // Vehicle Occupancy row, the last row, has "-" for percent
        const percentCellFormat = (i === table.rows.length - 1) ? /-/ : /\d+\.\d\s%/;
        assert.ok(modePercentCell.textContent.match(percentCellFormat));
      }
    }
  });
});
