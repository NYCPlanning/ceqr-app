import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import CensusTractsCalculator from '../calculators/transportation/census-tracts';
import TripResultsCalculator from '../calculators/transportation/trip-results';
import EmberObject from '@ember/object';

export default class TransportationPlanningFactorModel extends Model {
  MODES = [
    "auto",
    "taxi",
    "bus",
    "subway",
    "railroad",
    "walk",
    "ferry",
    "streetcar",
    "bicycle",
    "motorcycle",
    "other"
  ]
  
  // Set defaults on values not received from server
  ready() {
    // Default inOutSplits
    if (Object.keys(this.inOutSplits).length === 0) {
      this.set('inOutSplits', {
        am:       { in: 50, out: 50 },
        md:       { in: 50, out: 50 },
        pm:       { in: 50, out: 50 },
        saturday: { in: 50, out: 50 }
      });
    }

    // Default truckInOutSplits
    if (Object.keys(this.truckInOutSplits).length === 0) {
      this.set('truckInOutSplits', {
        allDay:  { in: 50, out: 50 }
      });
    }

    // Default modeSplits
    if (Object.keys(this.modeSplits).length === 0) {
      const modeSplits = {};
      this.MODES.forEach((m) => modeSplits[m] = { allPeriods: 0 });
      
      this.set('modeSplits', EmberObject.create(modeSplits));
    }

    // Default truckInOutSplits
    if (Object.keys(this.vehicleOccupancy).length === 0) {
      this.set('vehicleOccupancy', {
        auto: { allPeriods: 1 },
        taxi: { allPeriods: 1 }
      });
    }

    // Default modesForAnalysis
    if (Object.keys(this.modesForAnalysis).length === 0) {
      this.set('modesForAnalysis',     [
        "auto",
        "taxi",
        "bus",
        "subway",
        "walk",
        "railroad"
      ]);
    }
  }
  
  @belongsTo transportationAnalysis;
  @belongsTo dataPackage;
  
  @attr('string') landUse;
  @attr({defaultValue: () => {}}) tableNotes;
  @attr({defaultValue: () => []}) modesForAnalysis;
  
  // Census tract variable data if landUse is residential or office
  @attr({defaultValue: () => []}) censusTractVariables;
  @computed('censusTractVariables', 'transportationAnalysis.censusTractsSelection')
  get censusTractsCalculator() {
    return CensusTractsCalculator.create({
      censusTracts: this.censusTractVariables,
      modesForAnalysis: this.modesForAnalysis
    });
  }

  @attr('boolean') modeSplitsFromUser;
  @attr('ember-object', {defaultValue: () => {} }) modeSplits;
  
  @computed('modeSplitsFromUser', 'censusTractsCalculator')
  get calculatedModeSplits() {
    if (this.modeSplitsFromUser) {
      return this.modeSplits;
    } else {
      return this.censusTractsCalculator.modeSplits;
    }
  }

  // User-entered vehicle occupancy rate for "trip generation" existing conditions step
  @attr({defaultValue: () => {}}) vehicleOccupancy;
  @computed('modeSplitsFromUser', 'vehicleOccupancy', 'censusTractsCalculator')
  get calculatedVehicleOccupancy() {
    if (this.modeSplitsFromUser) {
      return this.vehicleOccupancy;
    } else {
      return {
        ...this.vehicleOccupancy,
        auto: { allPeriods: this.censusTractsCalculator.autoVehicleOccupancy }
      };
    }
  }

  // The percentage values for trip generation per-peak-hour In and Out trip distributions
  @attr({defaultValue: () => {}}) inOutSplits;
  @attr({defaultValue: () => {}}) truckInOutSplits;

  @computed('transportationAnalysis.project.{totalUnits,commercialLandUse}', 'landUse')
  get units() {
    if (this.landUse === 'residential') {
      return this.get('transportationAnalysis.project.totalUnits');
    }
    if (this.landUse === 'office') {
      const commercialLandUse = this.get('transportationAnalysis.project.commercialLandUse');
      return commercialLandUse.findBy('type', 'office').grossSqFt;
    }

    return 0;
  }
  @alias('calculatedTripResults.defaults.unitName') unitName;
  @alias('calculatedTripResults.defaults.tripGenRatePerUnit') tripGenRatePerUnit;
  @alias('calculatedTripResults.defaults') defaults;
  
  @computed('modesForAnalysis')
  get activeModes() {
    return this.MODES.filter((m) => this.modesForAnalysis.includes(m));
  }

  @computed('modesForAnalysis')
  get inactiveModes() {
    return this.MODES.reject((m) => this.modesForAnalysis.includes(m));
  }

  @computed('landUse', 'activeModes', 'transportationAnalysis.project')
  get calculatedTripResults() {
    return TripResultsCalculator.create({
      landUse: this.landUse,
      modeSplits: this.calculatedModeSplits,
      inOutSplits: this.inOutSplits,
      truckInOutSplits: this.truckInOutSplits,
      vehicleOccupancy: this.calculatedVehicleOccupancy,
      project: this.get('transportationAnalysis.project'),
      modes: this.activeModes,
      units: this.units
    });
  }
}
