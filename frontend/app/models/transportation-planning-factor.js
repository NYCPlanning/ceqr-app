import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import CensusTractsCalculator from '../calculators/transportation/census-tracts';
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
        am:  { in: 50, out: 50 },
        md:  { in: 50, out: 50 },
        pm:  { in: 50, out: 50 },
        sat: { in: 50, out: 50 }
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

  @alias('ceqrManualDefaults.units') units;
  @alias('ceqrManualDefaults.unitName') unitName;
  @alias('ceqrManualDefaults.tripGenRatePerUnit') tripGenRatePerUnit;
  
  @computed('modesForAnalysis')
  get activeModes() {
    return this.MODES.filter((m) => this.modesForAnalysis.includes(m));
  }

  @computed('modesForAnalysis')
  get inactiveModes() {
    return this.MODES.reject((m) => this.modesForAnalysis.includes(m));
  }

  @computed('transportationAnalysis.project.{totalUnits,commercialLandUse}')
  get peakHourTrips() {
    if (this.landUse === 'residential') {
      const units = this.get('transportationAnalysis.project.totalUnits');
      const normalizedUnits = units / this.ceqrManualDefaults.tripGenRatePerUnit;

      const weekdayUnits  = normalizedUnits * this.ceqrManualDefaults.tripGenerationRates.weekday.rate;
      const saturdayUnits = normalizedUnits * this.ceqrManualDefaults.tripGenerationRates.saturday.rate;

      return {
        am:       Math.round(weekdayUnits * this.ceqrManualDefaults.temporalDistribution.am.percent),
        md:       Math.round(weekdayUnits * this.ceqrManualDefaults.temporalDistribution.md.percent),
        pm:       Math.round(weekdayUnits * this.ceqrManualDefaults.temporalDistribution.pm.percent),
        saturday: Math.round(saturdayUnits * this.ceqrManualDefaults.temporalDistribution.saturday.percent)
      }
    }

    if (this.landUse === 'office') {      
      const units = this.get('transportationAnalysis.project.commercialLandUse').findBy('type', 'office').grossSqFt;
      const normalizedUnits = units / this.ceqrManualDefaults.tripGenRatePerUnit;

      const weekdayUnits  = normalizedUnits * this.ceqrManualDefaults.tripGenerationRates.weekday.rate;
      const saturdayUnits = normalizedUnits * this.ceqrManualDefaults.tripGenerationRates.saturday.rate;

      return {
        am:       Math.round(weekdayUnits * this.ceqrManualDefaults.temporalDistribution.am.percent),
        md:       Math.round(weekdayUnits * this.ceqrManualDefaults.temporalDistribution.md.percent),
        pm:       Math.round(weekdayUnits * this.ceqrManualDefaults.temporalDistribution.pm.percent),
        saturday: Math.round(saturdayUnits * this.ceqrManualDefaults.temporalDistribution.saturday.percent)
      }
    }

    return {};
  }

  

  @computed('transportationAnalysis.project.{totalUnits,commercialLandUse}')
  get ceqrManualDefaults() {
    if (this.landUse === 'residential') {
      const units = this.get('transportationAnalysis.project.totalUnits');
      
      return {
        units,
        unitName: 'DU',
        tripGenRatePerUnit: 1,
        tripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 8.075 },
          saturday: {label: "Saturday", rate: 9.6 },
          source: "2014 CEQR Technical Manual"
        },
        truckTripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 0.06 },
          saturday: {label: "Saturday", rate: 0.02 }
        },
        temporalDistribution: {
          am:       {label: "AM",       percent: .10 },
          md:       {label: "Midday",   percent: .05 },
          pm:       {label: "PM",       percent: .11 },
          saturday: {label: "Saturday", percent: .08 }
        },
        truckTemporalDistribution: {
          am:       {label: "AM",       percent: .12 },
          md:       {label: "Midday",   percent: .09 },
          pm:       {label: "PM",       percent: .02 },
          saturday: {label: "Saturday", percent: .09 }
        }
      };
    }

    if (this.landUse === 'office') {
      const commercialLandUse = this.get('transportationAnalysis.project.commercialLandUse');
      const units = commercialLandUse.findBy('type', 'office').grossSqFt;

      return {
        units,
        unitName: 'sq ft',
        tripGenRatePerUnit: 1000,
        tripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 18 },
          saturday: {label: "Saturday", rate: 3.9 }
        },
        truckTripGenerationRates: {
          weekday:  {label: "Weekday",  rate: 0.32 },
          saturday: {label: "Saturday", rate: 0.01 }
        },
        temporalDistribution: {
          am:       {label: "AM",       percent: .12 },
          md:       {label: "Midday",   percent: .15 },
          pm:       {label: "PM",       percent: .14 },
          saturday: {label: "Saturday", percent: .17 }
        },
        truckTemporalDistribution: {
          am:       {label: "AM",       percent: .10 },
          md:       {label: "Midday",   percent: .11 },
          pm:       {label: "PM",       percent: .02 },
          saturday: {label: "Saturday", percent: .11 }
        }
      };
    }

    return {};
  }


  // TODO: needs updating
  // Function to be passed to data-package-selector component to update data package
  updateDataPackage = (dataPackage) => {
    this.set('dataPackage', dataPackage);  
    this.save();
  }
}
