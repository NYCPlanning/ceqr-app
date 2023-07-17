import EmberObject, { computed } from '@ember/object';
import round from '../../utils/round';
import {
  censusTractVariableForMode,
  MODE_VARIABLE_LOOKUP,
} from '../../utils/censusTractVariableForMode';

/**
 * TransportationTdfCalculator is an EmberObject that calculates Trip Results for given inputs.
 *
 * @constructor
 * @param {array} censusTracts - an array of census tracts with their variables.
 *                               See tests/unit/calculators/census-tracts-test for an example.
 * @param {array} modesForAnalysis - an array of all mode ids.
 */

export default class TransportationCensusTractsCalculator extends EmberObject {
  @computed('totalCount', 'censusTracts')
  get modeSplits() {
    const splits = {};

    Object.keys(MODE_VARIABLE_LOOKUP).forEach((mode) => {
      const count = this.sumFor(censusTractVariableForMode(mode));

      splits[mode] = {
        allPeriods: round(100 * (count / this.totalCount), 1),
        count,
      };
    });

    return splits;
  }

  // totalCount is sum of values for each mode in `modesForAnalysis`,
  // across all census tracts in CensusTractVariables.
  @computed('modesForAnalysis')
  get totalCount() {
    return this.modesForAnalysis.reduce(
      (pv, m) => pv + this.sumFor(censusTractVariableForMode(m)),
      0
    );
  }

  @computed('censusTracts')
  get autoVehicleOccupancy() {
    let numberOfPeopleInCars = 0.0;
    let numberOfVehicles = 0.0;

    this.censusTracts.map((ct) => {
      numberOfPeopleInCars += ct.trans_auto_solo.value;
      numberOfVehicles += ct.trans_auto_solo.value;

      numberOfPeopleInCars += ct.trans_auto_2.value;
      numberOfVehicles += ct.trans_auto_2.value / 2;

      numberOfPeopleInCars += ct.trans_auto_3.value;
      numberOfVehicles += ct.trans_auto_3.value / 3;

      numberOfPeopleInCars += ct.trans_auto_4.value;
      numberOfVehicles += ct.trans_auto_4.value / 4;

      numberOfPeopleInCars += ct.trans_auto_5_or_6.value;
      numberOfVehicles += ct.trans_auto_5_or_6.value / 5.5;

      numberOfPeopleInCars += ct.trans_auto_7_or_more.value;
      numberOfVehicles += ct.trans_auto_7_or_more.value / 7;
    });

    return round(numberOfPeopleInCars / numberOfVehicles, 2);
  }

  sumFor = (variable) =>
    this.censusTracts.reduce((pv, t) => pv + t[variable].value, 0);
}
