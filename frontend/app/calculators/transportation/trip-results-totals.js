import EmberObject, { computed } from '@ember/object';

/**
 * TransportationTdfCalculator is an EmberObject that calculates Trip Results for given inputs.
 *
 * @constructor
 * @param {array[object]} tripResults - array of Trip Results objects to total
 * @param {array} modes - array of modes being analyzed
 */

export default class TransportationTripResultsTotalsCalculator extends EmberObject {
  @computed('tripResults', 'modes')
  get personTrips() {
    const results = {
      am: {},
      md: {},
      pm: {},
      saturday: {},
    };

    ['am', 'md', 'pm', 'saturday'].forEach((temporalId) => {
      this.modes.forEach((mode) => {
        let inTotal = 0;
        let outTotal = 0;

        // TODO: Below is likely a bug where `= +personTrips`
        // should actually be `+= personTrips`.
        // Get a second opinion on this before fixing.
        this.tripResults.forEach(({ personTrips }) => {
          inTotal = +personTrips[temporalId][mode].in;
          outTotal = +personTrips[temporalId][mode].out;
        });

        results[temporalId][mode] = {
          in: inTotal,
          out: outTotal,
          total: inTotal + outTotal,
        };
      });
    });

    return results;
  }

  @computed('tripResults', 'modes')
  get vehicleTrips() {
    const results = {
      am: {},
      md: {},
      pm: {},
      saturday: {},
    };

    ['am', 'md', 'pm', 'saturday'].forEach((temporalId) => {
      this.modes.forEach((mode) => {
        let inTotal = 0;
        let outTotal = 0;

        this.tripResults.forEach(({ vehicleTrips }) => {
          inTotal = +vehicleTrips[temporalId][mode].in;
          outTotal = +vehicleTrips[temporalId][mode].out;
        });

        results[temporalId][mode] = {
          in: inTotal,
          out: outTotal,
          total: inTotal + outTotal,
        };
      });
    });

    return results;
  }
}
