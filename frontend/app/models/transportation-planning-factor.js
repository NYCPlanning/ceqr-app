import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import CensusTractsCalculator from '../calculators/transportation/census-tracts';
import TripResultsCalculator from '../calculators/transportation/trip-results';
import { fragment } from 'ember-data-model-fragments/attributes';

export default class TransportationPlanningFactorModel extends Model.extend({

  // The percentage values for trip generation per-peak-hour In and Out trip distributions
  inOutSplits: fragment('in-out-splits', {
    defaultValue: () => ({
      am: fragment('in-out'),
      md: fragment('in-out'),
      pm: fragment('in-out'),
      saturday: fragment('in-out'),
    }),
  }),

  truckInOutSplits: fragment('truck-in-out-splits', {
    defaultValue: () => ({
      allDay: fragment('in-out'),
    }),
  }),

  // User-entered vehicle occupancy rate for "trip generation" existing conditions step
  vehicleOccupancyFromUser: fragment('vehicle-occupancy-from-user', {
    defaultValue: () => ({
      auto: fragment('vehicle-occupancy-time-periods'),
      taxi: fragment('vehicle-occupancy-time-periods'),
    }),
  }),

  modeSplitsFromUser: fragment('modes', {
    defaultValue: () => ({
      auto: fragment('mode-splits-time-periods'),
      taxi: fragment('mode-splits-time-periods'),
      bus: fragment('mode-splits-time-periods'),
      subway: fragment('mode-splits-time-periods'),
      railroad: fragment('mode-splits-time-periods'),
      walk: fragment('mode-splits-time-periods'),
      ferry: fragment('mode-splits-time-periods'),
      streetcar: fragment('mode-splits-time-periods'),
      bicycle: fragment('mode-splits-time-periods'),
      motorcycle: fragment('mode-splits-time-periods'),
      other: fragment('mode-splits-time-periods'),
    }),
  }),
}) {

  @belongsTo transportationAnalysis;
  @belongsTo dataPackage;

  @attr('string') landUse;
  @attr({
    defaultValue: () => {
      return {};
    }
  }) tableNotes;

  // Census tract variable data if landUse is residential or office
  @attr({ defaultValue: () => [] }) censusTractVariables;
  @computed('censusTractVariables', 'transportationAnalysis.censusTractsSelection.@each')
  get censusTractsCalculator() {
    return CensusTractsCalculator.create({
      censusTracts: this.censusTractVariables,
      modesForAnalysis: this.modesForAnalysis
    });
  }

  @attr('boolean') manualModeSplits;
  @attr('boolean') temporalModeSplits;
  @attr('boolean') temporalVehicleOccupancy;

  @computed('manualModeSplits', 'censusTractsCalculator', 'modeSplitsFromUser')
  get modeSplits() {
    if (this.manualModeSplits) {
      return this.modeSplitsFromUser;
    } else {
      return this.censusTractsCalculator.modeSplits;
    }
  }
  set modeSplits(modeSplits) {
    this.set('modeSplitsFromUser', modeSplits);
  }

  @computed('manualModeSplits', 'vehicleOccupancyFromUser', 'censusTractsCalculator')
  get vehicleOccupancy() {
    return this.vehicleOccupancyFromUser;
  }
  set vehicleOccupancy(value) {
    this.set('vehicleOccupancyFromUser', value);
  }

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
  @alias('tripResults.defaults.unitName') unitName;
  @alias('tripResults.defaults.tripGenRatePerUnit') tripGenRatePerUnit;
  @alias('tripResults.defaults') defaults;

  @alias('transportationAnalysis.modesForAnalysis') modesForAnalysis;
  @alias('transportationAnalysis.activeModes') activeModes;
  @alias('transportationAnalysis.inactiveModes') inactiveModes;

  @computed(
    'landUse',
    'activeModes',
    'modeSplits',
    'vehicleOccupancy',
    'inOutSplits',
    'truckInOutSplits',
    'transportationAnalysis.project'
  )
  get tripResults() {
    return TripResultsCalculator.create({
      landUse: this.landUse,
      modeSplits: this.modeSplits,
      inOutSplits: this.inOutSplits,
      truckInOutSplits: this.truckInOutSplits,
      vehicleOccupancy: this.vehicleOccupancy,
      project: this.get('transportationAnalysis.project'),
      manualModeSplits: this.manualModeSplits,
      temporalModeSplits: this.temporalModeSplits,
      temporalVehicleOccupancy: this.temporalVehicleOccupancy,
      modes: this.activeModes,
      units: this.units
    });
  }
}
