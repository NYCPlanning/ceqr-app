import EmberObject from '@ember/object';
import { computed } from '@ember-decorators/object';
import round from '../../utils/round';
import { censusTractVariableForMode, MODE_VARIABLE_LOOKUP } from '../../utils/censusTractVariableForMode';

/**
 * TransportationTdfCalculator is an EmberObject that calculates Trip Results for given inputs.
 *
 * @constructor
 * @param {array} censusTracts - an array of census tracts with their variables
 * @param {array} modesForAnalysis - an array of all mode ids 
 */

export default class TransportationCensusTractsCalculator extends EmberObject {  
  @computed('totalCount', 'censusTracts')
  get modeSplits() {
    let splits = {};
    
    Object.keys(MODE_VARIABLE_LOOKUP).forEach((mode) => {
      const count = this.sumFor(censusTractVariableForMode(mode));
      
      splits[mode] = { allPeriods: 100 * round(count / this.totalCount, 3), count};
    });

    return splits;
  }

  @computed('modesForAnalysis')
  get totalCount() {
    return this.modesForAnalysis.reduce((pv, m) => pv + this.sumFor(censusTractVariableForMode(m)), 0);
  }

  @computed('censusTracts')
  get autoVehicleOccupancy() {
    let numberOfPeopleInCars = 0.0;
    let numberOfVehicles     = 0.0;
    
    this.censusTracts.map((ct) => {
      numberOfPeopleInCars += ct.trans_auto_solo.value;
      numberOfVehicles     += ct.trans_auto_solo.value;

      numberOfPeopleInCars += ct.trans_auto_2.value;
      numberOfVehicles     += (ct.trans_auto_2.value / 2);

      numberOfPeopleInCars += ct.trans_auto_3.value;
      numberOfVehicles     += (ct.trans_auto_3.value / 3);

      numberOfPeopleInCars += ct.trans_auto_4.value;
      numberOfVehicles     += (ct.trans_auto_4.value / 4);

      numberOfPeopleInCars += ct.trans_auto_5_or_6.value;
      numberOfVehicles     += (ct.trans_auto_5_or_6.value / 5.5);

      numberOfPeopleInCars += ct.trans_auto_7_or_more.value;
      numberOfVehicles     += (ct.trans_auto_7_or_more.value / 7);
    });
    
    return round(numberOfPeopleInCars / numberOfVehicles, 2);
  }

  sumFor = (variable) => {
    return this.censusTracts.reduce((pv, t) => pv + t[variable].value, 0);
  }
}
