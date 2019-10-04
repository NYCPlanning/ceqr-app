import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationPlanningFactorModel extends Model {
  @belongsTo transportationAnalysis;
  @belongsTo dataPackage;
  
  @attr('string') landUse;
  @attr({defaultValue: () => {}}) tableNotes;
  @attr({defaultValue: () => []}) modesForAnalysis;
  
  // Census tract variable data if landUse is residential or office
  @attr({defaultValue: () => []}) censusTractVariables;
  
  @attr('boolean') modeSplitsFromUser;
  @attr({defaultValue: () => {}}) modeSplits;
  // User-entered vehicle occupancy rate for "trip generation" existing conditions step
  @attr({defaultValue: () => {}}) vehicleOccupancy;

  // The percentage values for trip generation per-peak-hour In and Out trip distributions
  @attr({defaultValue: () => {}}) inOutSplits;
  @attr({defaultValue: () => {}}) truckInOutSplits;

  @alias('unitsOfAnalysis.units') units;
  @alias('unitsOfAnalysis.unitName') unitName;
  @alias('unitsOfAnalysis.tripGenRatePerUnit') tripGenRatePerUnit;
  @alias('unitsOfAnalysis.tripGenerationRates') tripGenerationRates;
  
  @computed('transportationAnalysis.project.{totalUnits,commercialLandUse}')
  get unitsOfAnalysis() {
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
    switch (dataPackage.package) {
      case "nyc_acs":
        this.set('nycAcsDataPackage', dataPackage);  
        break;
      case "ctpp":
        this.set('ctppDataPackage', dataPackage);  
        break;
    }

    this.save();
  }
}
