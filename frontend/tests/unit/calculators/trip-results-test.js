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
});
