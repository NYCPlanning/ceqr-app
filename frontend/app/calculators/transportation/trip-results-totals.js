import EmberObject from '@ember/object';
import { computed } from '@ember-decorators/object';

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
    let results = {
      am: {},
      md: {},
      pm: {},
      saturday: {}
    };

    ["am", "md", "pm", "saturday"].forEach((temporalId) => {
      this.modes.forEach((mode) => {
        let inTotal = 0;
        let outTotal = 0;
        
        this.tripResults.forEach((tripResults) => {
          inTotal  =+ tripResults[temporalId][mode].in
          outTotal =+ tripResults[temporalId][mode].out
        });

        results[temporalId][mode] = {
          in: inTotal,
          out: outTotal,
          total: inTotal + outTotal
        }
      });
    });

    return results;
  }

  @computed('tripResults', 'modes')
  get vehicleTrips() {
    let results = {
      am: {},
      md: {},
      pm: {},
      saturday: {}
    };

    return results;
  }
}
