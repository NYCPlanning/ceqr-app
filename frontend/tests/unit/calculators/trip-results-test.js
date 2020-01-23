import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import trCalc from 'labs-ceqr/calculators/transportation/trip-results';

module('Unit | Calculator | transportation-trip-results', function (hooks) {
  setupTest(hooks);

  test('it calculates normalizedUnits', function (assert) {
    const units = 5;
    // landUse here is necessary for the Calculator to determine
    // which default value of tripGenRatePerUnit is used
    // in order to compute normalizedUnits.
    const landUse = 'residential';
    const newTrCalc = trCalc.create({
      units,
      landUse,
    });

    // round(units/tripGenRatePerUnit) = normalizedUnits
    assert.equal(newTrCalc.normalizedUnits, 5);
  });

  test('it calculates personTrips', function (assert) {
    const newTrCalc = trCalc.create({
      units: 5,
      landUse: 'residential',
      inOutSplits: {
        am: { in: 50, out: 50 }, md: { in: 50, out: 50 }, pm: { in: 50, out: 50 }, saturday: { in: 50, out: 50 },
      },
      modes: [
        'auto',
        'taxi',
        'bus',
        'subway',
        'railroad',
        'walk',
      ],
      manualModeSplits: false,
      temporalModeSplits: false,
      modeSplits: {
        auto: { allPeriods: 6.8, count: 1034 },
        taxi: { allPeriods: 6.5, count: 991 },
        bus: { allPeriods: 0.5, count: 71 },
        subway: { allPeriods: 57.4, count: 8771 },
        railroad: { allPeriods: 1.9, count: 297 },
        walk: { allPeriods: 27, count: 4129 },
        ferry: { allPeriods: 0, count: 0 },
        streetcar: { allPeriods: 0, count: 0 },
        bicycle: { allPeriods: 4.4, count: 673 },
        motorcycle: { allPeriods: 0, count: 0 },
        other: { allPeriods: 1.4, count: 212 },
      },
    });

    assert.deepEqual(newTrCalc.personTrips, {
      am: {
        total: { in: 2, out: 2, total: 4 }, auto: { in: 0, out: 0, total: 0 }, taxi: { in: 0, out: 0, total: 0 }, bus: { in: 0, out: 0, total: 0 }, subway: { in: 1, out: 1, total: 2 }, railroad: { in: 0, out: 0, total: 0 }, walk: { in: 1, out: 1, total: 2 }, allModesTotal: { in: 2.01875, out: 2.01875, total: 4.0375 },
      },
      md: {
        total: { in: 1, out: 1, total: 2 }, auto: { in: 0, out: 0, total: 0 }, taxi: { in: 0, out: 0, total: 0 }, bus: { in: 0, out: 0, total: 0 }, subway: { in: 1, out: 1, total: 2 }, railroad: { in: 0, out: 0, total: 0 }, walk: { in: 0, out: 0, total: 0 }, allModesTotal: { in: 1.009375, out: 1.009375, total: 2.01875 },
      },
      pm: {
        total: { in: 2, out: 2, total: 4 }, auto: { in: 0, out: 0, total: 0 }, taxi: { in: 0, out: 0, total: 0 }, bus: { in: 0, out: 0, total: 0 }, subway: { in: 1, out: 1, total: 2 }, railroad: { in: 0, out: 0, total: 0 }, walk: { in: 1, out: 1, total: 2 }, allModesTotal: { in: 2.220625, out: 2.220625, total: 4.44125 },
      },
      saturday: {
        total: { in: 2, out: 2, total: 4 }, auto: { in: 0, out: 0, total: 0 }, taxi: { in: 0, out: 0, total: 0 }, bus: { in: 0, out: 0, total: 0 }, subway: { in: 1, out: 1, total: 2 }, railroad: { in: 0, out: 0, total: 0 }, walk: { in: 1, out: 1, total: 2 }, allModesTotal: { in: 1.92, out: 1.92, total: 3.84 },
      },
    });
  });

  test('it calculates vehicleTrips', function (assert) {
    const newTrCalc = trCalc.create({
      // A high number is used here so that values inside
      // newTrCalc.vehicleTrip do not round to 0
      units: 1000,
      landUse: 'residential',
      // The four properties below are directly referenced
      // by the newTrCalc.vehicleTrips CP
      truckInOutSplits: { allDay: { in: 50, out: 50 } },
      modes: [
        'auto',
        'taxi',
        'bus',
        'subway',
        'railroad',
        'walk',
      ],
      temporalVehicleOccupancy: false,
      vehicleOccupancy: {
        auto: {
          am: 1, md: 1, pm: 1, saturday: 1, allPeriods: 1,
        },
        taxi: {
          am: 1, md: 1, pm: 1, saturday: 1, allPeriods: 1,
        },
      },
      // newTrCalc.vehicleTrips also depends on newTrCalc.personTrips.
      // personTrips depends on the following four properties
      inOutSplits: {
        am: { in: 50, out: 50 }, md: { in: 50, out: 50 }, pm: { in: 50, out: 50 }, saturday: { in: 50, out: 50 },
      },
      manualModeSplits: false,
      temporalModeSplits: false,
      modeSplits: {
        auto: { allPeriods: 6.8, count: 1034 },
        taxi: { allPeriods: 6.5, count: 991 },
        bus: { allPeriods: 0.5, count: 71 },
        subway: { allPeriods: 57.4, count: 8771 },
        railroad: { allPeriods: 1.9, count: 297 },
        walk: { allPeriods: 27, count: 4129 },
        ferry: { allPeriods: 0, count: 0 },
        streetcar: { allPeriods: 0, count: 0 },
        bicycle: { allPeriods: 4.4, count: 673 },
        motorcycle: { allPeriods: 0, count: 0 },
        other: { allPeriods: 1.4, count: 212 },
      },
    });

    assert.deepEqual(newTrCalc.vehicleTrips, {
      am: {
        auto: {
          in: 27,
          out: 27,
          total: 54,
          unbalancedIn: undefined,
          unbalancedOut: undefined,
          unbalancedTotal: NaN,
        },
        truck: {
          in: 4,
          out: 4,
          total: 8,
        },
        total: {
          in: 83,
          out: 83,
          total: 166,
        },
        taxi: {
          in: 52,
          out: 52,
          total: 104,
          unbalancedIn: 26,
          unbalancedOut: 26,
          unbalancedTotal: 52,
        },
      },
      md: {
        auto: {
          in: 14,
          out: 14,
          total: 28,
          unbalancedIn: undefined,
          unbalancedOut: undefined,
          unbalancedTotal: NaN,
        },
        truck: {
          in: 3,
          out: 3,
          total: 6,
        },
        total: {
          in: 43,
          out: 43,
          total: 86,
        },
        taxi: {
          in: 26,
          out: 26,
          total: 52,
          unbalancedIn: 13,
          unbalancedOut: 13,
          unbalancedTotal: 26,
        },
      },
      pm: {
        auto: {
          in: 30,
          out: 30,
          total: 60,
          unbalancedIn: undefined,
          unbalancedOut: undefined,
          unbalancedTotal: NaN,
        },
        truck: {
          in: 1,
          out: 1,
          total: 2,
        },
        total: {
          in: 89,
          out: 89,
          total: 178,
        },
        taxi: {
          in: 58,
          out: 58,
          total: 116,
          unbalancedIn: 29,
          unbalancedOut: 29,
          unbalancedTotal: 58,
        },
      },
      saturday: {
        auto: {
          in: 26,
          out: 26,
          total: 52,
          unbalancedIn: undefined,
          unbalancedOut: undefined,
          unbalancedTotal: NaN,
        },
        truck: {
          in: 1,
          out: 1,
          total: 2,
        },
        total: {
          in: 77,
          out: 77,
          total: 154,
        },
        taxi: {
          in: 50,
          out: 50,
          total: 100,
          unbalancedIn: 25,
          unbalancedOut: 25,
          unbalancedTotal: 50,
        },
      },
    });
  });
});
