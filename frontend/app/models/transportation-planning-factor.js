import Model, { attr, belongsTo } from '@ember-data';
import EmberObject, { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { MODES } from 'labs-ceqr/utils/censusTractVariableForMode';
import CensusTractsCalculator from '../calculators/transportation/census-tracts';
import TripResultsCalculator from '../calculators/transportation/trip-results';

export default Model.extend({
  // Set defaults on values not received from server
  ready() {
    // Default inOutSplits
    if (Object.keys(this.inOutSplits).length === 0) {
      this.set('inOutSplits', {
        am: { in: 50, out: 50 },
        md: { in: 50, out: 50 },
        pm: { in: 50, out: 50 },
        saturday: { in: 50, out: 50 },
      });
    }

    // Default truckInOutSplits
    if (Object.keys(this.truckInOutSplits).length === 0) {
      this.set('truckInOutSplits', {
        allDay: { in: 50, out: 50 },
      });
    }

    // Default modeSplits
    if (Object.keys(this.modeSplitsFromUser).length === 0) {
      const modeSplitsFromUser = {};
      MODES.forEach(
        (m) =>
          (modeSplitsFromUser[m] = {
            am: 0,
            md: 0,
            pm: 0,
            saturday: 0,
            allPeriods: 0,
          })
      );

      this.set('modeSplitsFromUser', EmberObject.create(modeSplitsFromUser));
    }

    // Default truckInOutSplits
    if (Object.keys(this.vehicleOccupancyFromUser).length === 0) {
      this.set('vehicleOccupancyFromUser', {
        auto: {
          am: 1,
          md: 1,
          pm: 1,
          saturday: 1,
          allPeriods: 1,
        },
        taxi: {
          am: 1,
          md: 1,
          pm: 1,
          saturday: 1,
          allPeriods: 1,
        },
      });
    }
  },

  transportationAnalysis: belongsTo('transportation-analysis'),

  dataPackage: belongsTo('data-package'),

  landUse: attr('string'),

  tableNotes: attr('', {
    defaultValue: () => ({}),
  }),

  // Census tract variable data if landUse is residential or office
  censusTractVariables: attr('', { defaultValue: () => [] }),

  censusTractsCalculator: computed(
    'censusTractVariables',
    'modesForAnalysis',
    'transportationAnalysis.censusTractsSelection.[]',
    function () {
      return CensusTractsCalculator.create({
        censusTracts: this.censusTractVariables,
        modesForAnalysis: this.modesForAnalysis,
      });
    }
  ),

  manualModeSplits: attr('boolean'),

  temporalModeSplits: attr('boolean'),

  temporalVehicleOccupancy: attr('boolean'),

  modeSplitsFromUser: attr('ember-object', {
    defaultValue: () => ({}),
  }),

  modeSplits: computed(
    'censusTractsCalculator.modeSplits',
    'manualModeSplits',
    'modeSplitsFromUser',
    function () {
      if (this.manualModeSplits) {
        return this.modeSplitsFromUser;
      }
      return this.censusTractsCalculator.modeSplits;
    }
  ),

  // User-entered vehicle occupancy rate for "trip generation" existing conditions step
  vehicleOccupancyFromUser: attr('', {
    defaultValue: () => ({}),
  }),

  vehicleOccupancy: computed.reads('vehicleOccupancyFromUser'),

  // The percentage values for trip generation per-peak-hour In and Out trip distributions
  inOutSplits: attr('', {
    defaultValue: () => ({}),
  }),

  truckInOutSplits: attr('', {
    defaultValue: () => ({}),
  }),

  units: computed(
    'transportationAnalysis.project.{totalUnits,commercialLandUse}',
    'landUse',
    function () {
      if (this.landUse === 'residential') {
        return this.transportationAnalysis.project.totalUnits;
      }
      if (this.landUse === 'office') {
        const commercialLandUse =
          this.transportationAnalysis.project.commercialLandUse;
        return commercialLandUse.findBy('type', 'office').grossSqFt;
      }

      return 0;
    }
  ),

  unitName: alias('tripResults.defaults.unitName'),

  tripGenRatePerUnit: alias('tripResults.defaults.tripGenRatePerUnit'),

  defaults: alias('tripResults.defaults'),

  modesForAnalysis: alias('transportationAnalysis.modesForAnalysis'),

  activeModes: alias('transportationAnalysis.activeModes'),

  inactiveModes: alias('transportationAnalysis.inactiveModes'),

  tripResults: computed(
    'activeModes',
    'inOutSplits',
    'landUse',
    'manualModeSplits',
    'modeSplits',
    'temporalModeSplits',
    'temporalVehicleOccupancy',
    'transportationAnalysis.project',
    'truckInOutSplits',
    'units',
    'vehicleOccupancy',
    function () {
      return TripResultsCalculator.create({
        landUse: this.landUse,
        modeSplits: this.modeSplits,
        inOutSplits: this.inOutSplits,
        truckInOutSplits: this.truckInOutSplits,
        vehicleOccupancy: this.vehicleOccupancy,
        project: this.transportationAnalysis.project,
        manualModeSplits: this.manualModeSplits,
        temporalModeSplits: this.temporalModeSplits,
        temporalVehicleOccupancy: this.temporalVehicleOccupancy,
        modes: this.activeModes,
        units: this.units,
      });
    }
  ),
});
