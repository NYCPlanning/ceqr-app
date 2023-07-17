import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getAggregatePercent } from 'labs-ceqr/helpers/get-aggregate-percent';
import {
  MODAL_SPLIT_VARIABLES_SUBSET,
  VARIABLE_MODE_LOOKUP,
} from 'labs-ceqr/utils/modalSplit';

module(
  'Unit | Component | transportation/trip-generation-tables/trip-generation-results',
  function (hooks) {
    setupTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async function () {
      this.stubAnalysis = {
        taxiVehicleOccupancy: 2,
        residentialUnits: 500,
        inOutDists: {
          am: {
            in: 51,
            out: 49,
          },
          md: {
            in: 62,
            out: 38,
          },
          pm: {
            in: 34,
            out: 66,
          },
          saturday: {
            in: 56,
            out: 44,
          },
        },
        dailyTripRate: {
          weekday: { label: 'Weekday', rate: 8.075 },
          saturday: { label: 'Saturday', rate: 9.6 },
        },
        temporalDistributions: {
          am: { label: 'AM', percent: 10, decimal: 0.1 },
          md: { label: 'MD', percent: 5, decimal: 0.05 },
          pm: { label: 'PM', percent: 11, decimal: 0.11 },
          saturday: { label: 'Saturday', percent: 8, decimal: 0.08 },
        },
      };
      this.stubSelectedCensusTractData = [
        {
          trans_commuter_total: {
            variable: 'trans_commuter_total',
            value: 10,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_commuter_total,
          },
          trans_auto_total: {
            variable: 'trans_auto_total',
            value: 1,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_auto_total,
          },
          trans_taxi: {
            variable: 'trans_taxi',
            value: 2,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_taxi,
          },
          trans_public_bus: {
            variable: 'trans_public_bus',
            value: 3,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_public_bus,
          },
          trans_public_subway: {
            variable: 'trans_public_subway',
            value: 4,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_public_subway,
          },
          trans_walk: {
            variable: 'trans_walk',
            value: 5,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_walk,
          },
          vehicle_occupancy: {
            variable: 'vehicle_occupancy',
            value: 6,
            moe: null,
            mode: VARIABLE_MODE_LOOKUP.vehicle_occupancy,
          },
        },
        {
          trans_commuter_total: {
            variable: 'trans_commuter_total',
            value: 20,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_commuter_total,
          },
          trans_auto_total: {
            variable: 'trans_auto_total',
            value: 21,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_auto_total,
          },
          trans_taxi: {
            variable: 'trans_taxi',
            value: 3,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_taxi,
          },
          trans_public_bus: {
            variable: 'trans_public_bus',
            value: 4,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_public_bus,
          },
          trans_public_subway: {
            variable: 'trans_public_subway',
            value: 5,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_public_subway,
          },
          trans_walk: {
            variable: 'trans_walk',
            value: 6,
            moe: 1,
            mode: VARIABLE_MODE_LOOKUP.trans_walk,
          },
          vehicle_occupancy: {
            variable: 'vehicle_occupancy',
            value: 7,
            moe: null,
            mode: VARIABLE_MODE_LOOKUP.vehicle_occupancy,
          },
        },
      ];
      this.modeLookup = VARIABLE_MODE_LOOKUP;
      this.modalSplitVariablesSubset = MODAL_SPLIT_VARIABLES_SUBSET;

      this.tripGenResultsTable = this.owner.lookup(
        'component:transportation/trip-generation-tables/trip-generation-results'
      );
      this.tripGenResultsTable.set('analysis', this.stubAnalysis);
      this.tripGenResultsTable.set(
        'selectedCensusTractData',
        this.stubSelectedCensusTractData
      );
      this.tripGenResultsTable.set('modeLookup', this.modeLookup);
      this.tripGenResultsTable.set(
        'modalSplitVariablesSubset',
        this.modalSplitVariablesSubset
      );
    });

    test('it correctly calculates modeAggregatePercents', async function (assert) {
      assert.deepEqual(this.tripGenResultsTable.modeAggregatePercents, {
        trans_auto_total:
          getAggregatePercent([
            this.stubSelectedCensusTractData,
            ['trans_auto_total'],
            false,
          ]) / 100,
        trans_taxi:
          getAggregatePercent([
            this.stubSelectedCensusTractData,
            ['trans_taxi'],
            false,
          ]) / 100,
        trans_public_bus:
          getAggregatePercent([
            this.stubSelectedCensusTractData,
            ['trans_public_bus'],
            false,
          ]) / 100,
        trans_public_subway:
          getAggregatePercent([
            this.stubSelectedCensusTractData,
            ['trans_public_subway'],
            false,
          ]) / 100,
        trans_walk:
          getAggregatePercent([
            this.stubSelectedCensusTractData,
            ['trans_walk'],
            false,
          ]) / 100,
      });
    });

    test('it spot checks weekdayModeCalcs for public-bus/midday/out-direction', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.weekdayModeCalcs.md.out.trans_public_bus,
        this.stubAnalysis.residentialUnits *
          this.stubAnalysis.dailyTripRate.weekday.rate *
          this.stubAnalysis.temporalDistributions.md.decimal *
          (this.stubAnalysis.inOutDists.md.out / 100) *
          this.tripGenResultsTable.modeAggregatePercents.trans_public_bus
      );
    });

    test('it spot checks weekdayModesTotals for pm/in', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.weekdayModesTotals.pm.in,
        this.tripGenResultsTable.weekdayModeCalcs.pm.in.trans_auto_total +
          this.tripGenResultsTable.weekdayModeCalcs.pm.in.trans_taxi +
          this.tripGenResultsTable.weekdayModeCalcs.pm.in.trans_public_bus +
          this.tripGenResultsTable.weekdayModeCalcs.pm.in.trans_public_subway +
          this.tripGenResultsTable.weekdayModeCalcs.pm.in.trans_walk
      );
    });

    test('it spot checks totalsOfWeekdayMode for am/trans_walk', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfWeekdayMode.am.trans_walk,
        this.tripGenResultsTable.weekdayModeCalcs.am.in.trans_walk +
          this.tripGenResultsTable.weekdayModeCalcs.am.out.trans_walk
      );
    });

    test('it spot checks totalsOfTotalsOfWeekdayMode for md', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfTotalsOfWeekdayMode.am,
        this.tripGenResultsTable.totalsOfWeekdayMode.am.trans_auto_total +
          this.tripGenResultsTable.totalsOfWeekdayMode.am.trans_taxi +
          this.tripGenResultsTable.totalsOfWeekdayMode.am.trans_public_bus +
          this.tripGenResultsTable.totalsOfWeekdayMode.am.trans_public_subway +
          this.tripGenResultsTable.totalsOfWeekdayMode.am.trans_walk
      );
    });

    test('it spot checks saturdayModeCalcs for out/trans_auto_total', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.saturdayModeCalcs.out.trans_auto_total,
        this.stubAnalysis.residentialUnits *
          this.stubAnalysis.dailyTripRate.saturday.rate *
          this.stubAnalysis.temporalDistributions.saturday.decimal *
          (this.stubAnalysis.inOutDists.saturday.out / 100) *
          this.tripGenResultsTable.modeAggregatePercents.trans_auto_total
      );
    });

    test('it spot checks saturdayModesTotals for in direction', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.saturdayModesTotals.in,
        this.tripGenResultsTable.saturdayModeCalcs.in.trans_auto_total +
          this.tripGenResultsTable.saturdayModeCalcs.in.trans_taxi +
          this.tripGenResultsTable.saturdayModeCalcs.in.trans_public_bus +
          this.tripGenResultsTable.saturdayModeCalcs.in.trans_public_subway +
          this.tripGenResultsTable.saturdayModeCalcs.in.trans_walk
      );
    });

    test('it spot checks totalsOfSaturdayMode for trans_taxi', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfSaturdayMode.trans_taxi,
        this.tripGenResultsTable.saturdayModeCalcs.in.trans_taxi +
          this.tripGenResultsTable.saturdayModeCalcs.out.trans_taxi
      );
    });

    test('it calculates totalOfTotalsOfSaturdayMode', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalOfTotalsOfSaturdayMode,
        this.tripGenResultsTable.totalsOfSaturdayMode.trans_auto_total +
          this.tripGenResultsTable.totalsOfSaturdayMode.trans_taxi +
          this.tripGenResultsTable.totalsOfSaturdayMode.trans_public_bus +
          this.tripGenResultsTable.totalsOfSaturdayMode.trans_public_subway +
          this.tripGenResultsTable.totalsOfSaturdayMode.trans_walk
      );
    });

    test('it correctly calculates vehicle occupancy', async function (assert) {
      assert.equal(this.tripGenResultsTable.vehicleOccupancy, (6 + 7) / 2);
    });

    test('it spot checks weekdayAutoVehicleTripCalcs for md/out', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.weekdayAutoVehicleTripCalcs.md.out,
        this.tripGenResultsTable.weekdayModeCalcs.md.out.trans_auto_total /
          this.tripGenResultsTable.vehicleOccupancy
      );
    });

    test('it spot checks weekdayTaxiVehicleTripCalcs for am/in', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.weekdayTaxiVehicleTripCalcs.am.in,
        this.tripGenResultsTable.weekdayModeCalcs.am.in.trans_taxi /
          this.stubAnalysis.taxiVehicleOccupancy
      );
    });

    test('it spot checks weekdayVehicleTripTotals for pm/out', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.weekdayVehicleTripTotals.pm.out,
        this.tripGenResultsTable.weekdayAutoVehicleTripCalcs.pm.out +
          this.tripGenResultsTable.weekdayTaxiVehicleTripCalcs.pm.out
      );
    });

    test('it spot checks totalsOfWeekdayAutoVehicleTrip for md', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfWeekdayAutoVehicleTrip.md,
        this.tripGenResultsTable.weekdayAutoVehicleTripCalcs.md.in +
          this.tripGenResultsTable.weekdayAutoVehicleTripCalcs.md.out
      );
    });

    test('it spot checks totalsOfWeekdayTaxiVehicleTrip for pm', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfWeekdayTaxiVehicleTrip.pm,
        this.tripGenResultsTable.weekdayTaxiVehicleTripCalcs.pm.in +
          this.tripGenResultsTable.weekdayTaxiVehicleTripCalcs.pm.out
      );
    });

    test('it spot checks totalsOfTotalsOfWeekdayVehicleTrip for am', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfTotalsOfWeekdayVehicleTrip.am,
        this.tripGenResultsTable.totalsOfWeekdayAutoVehicleTrip.am +
          this.tripGenResultsTable.totalsOfWeekdayTaxiVehicleTrip.am
      );
    });

    test('it spot checks totalsOfTotalsOfWeekdayVehicleTrip for am', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalsOfTotalsOfWeekdayVehicleTrip.am,
        this.tripGenResultsTable.totalsOfWeekdayAutoVehicleTrip.am +
          this.tripGenResultsTable.totalsOfWeekdayTaxiVehicleTrip.am
      );
    });

    test('it spot checks saturdayAutoVehicleTripCalcs for in', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.saturdayAutoVehicleTripCalcs.in,
        this.tripGenResultsTable.saturdayModeCalcs.in.trans_auto_total /
          this.tripGenResultsTable.vehicleOccupancy
      );
    });

    test('it spot checks saturdayTaxiVehicleTripCalcs for out', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.saturdayTaxiVehicleTripCalcs.out,
        this.tripGenResultsTable.saturdayModeCalcs.out.trans_taxi /
          this.stubAnalysis.taxiVehicleOccupancy
      );
    });

    test('it spot checks saturdayVehicleTripTotals for in', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.saturdayVehicleTripTotals.in,
        this.tripGenResultsTable.saturdayAutoVehicleTripCalcs.in +
          this.tripGenResultsTable.saturdayTaxiVehicleTripCalcs.in
      );
    });

    test('it spot checks totalOfSaturdayAutoVehicleTrip', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalOfSaturdayAutoVehicleTrip,
        this.tripGenResultsTable.saturdayAutoVehicleTripCalcs.in +
          this.tripGenResultsTable.saturdayAutoVehicleTripCalcs.out
      );
    });

    test('it spot checks totalOfSaturdayTaxiVehicleTrip', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalOfSaturdayTaxiVehicleTrip,
        this.tripGenResultsTable.saturdayTaxiVehicleTripCalcs.in +
          this.tripGenResultsTable.saturdayTaxiVehicleTripCalcs.out
      );
    });

    test('it spot checks totalOfTotalsOfSaturdayVehicleTrip', async function (assert) {
      assert.equal(
        this.tripGenResultsTable.totalOfTotalsOfSaturdayVehicleTrip,
        this.tripGenResultsTable.totalOfSaturdayAutoVehicleTrip +
          this.tripGenResultsTable.totalOfSaturdayTaxiVehicleTrip
      );
    });
  }
);
