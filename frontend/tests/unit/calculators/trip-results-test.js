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
});
