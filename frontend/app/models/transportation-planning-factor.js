import Model, { attr, belongsTo } from '@ember-data/model';
import EmberObject, { computed, get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { MODES } from 'labs-ceqr/utils/censusTractVariableForMode';
import CensusTractsCalculator from '../calculators/transportation/census-tracts';
import TripResultsCalculator from '../calculators/transportation/trip-results';

export default class TransportationPlanningFactorModel extends Model {
  // Set defaults on values not received from server
  ready() {
    // Default inOutSplits
    if (Object.keys(this.inOutSplits).length === 0) {
      set(this, 'inOutSplits', {
        am: { in: 50, out: 50 },
        md: { in: 50, out: 50 },
        pm: { in: 50, out: 50 },
        saturday: { in: 50, out: 50 },
      });
    }

    // Default truckInOutSplits
    if (Object.keys(this.truckInOutSplits).length === 0) {
      set(this, 'truckInOutSplits', {
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

      set(this, 'modeSplitsFromUser', EmberObject.create(modeSplitsFromUser));
    }

    // Default truckInOutSplits
    if (Object.keys(this.vehicleOccupancyFromUser).length === 0) {
      set(this, 'vehicleOccupancyFromUser', {
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
  }

  @belongsTo transportationAnalysis;

  @belongsTo dataPackage;

  @attr('string') landUse;

  @attr({
    defaultValue: () => ({}),
  })
  tableNotes;

  // Census tract variable data if landUse is residential or office
  @attr({ defaultValue: () => [] }) censusTractVariables;

  @computed(
    'censusTractVariables',
    'modesForAnalysis',
    'transportationAnalysis.censusTractsSelection.[]'
  )
  get censusTractsCalculator() {
    return CensusTractsCalculator.create({
      censusTracts: this.censusTractVariables,
      modesForAnalysis: this.modesForAnalysis,
    });
  }

  @attr('boolean') manualModeSplits;

  @attr('boolean') temporalModeSplits;

  @attr('boolean') temporalVehicleOccupancy;

  @attr('ember-object', {
    defaultValue: () => ({}),
  })
  modeSplitsFromUser;

  @computed(
    'censusTractsCalculator.modeSplits',
    'manualModeSplits',
    'modeSplitsFromUser'
  )
  get modeSplits() {
    if (this.manualModeSplits) {
      return this.modeSplitsFromUser;
    }
    return this.censusTractsCalculator.modeSplits;
  }

  set modeSplits(modeSplits) {
    set(this, 'modeSplitsFromUser', modeSplits);
  }

  // User-entered vehicle occupancy rate for "trip generation" existing conditions step
  @attr({
    defaultValue: () => ({}),
  })
  vehicleOccupancyFromUser;

  @computed(
    'manualModeSplits',
    'vehicleOccupancyFromUser',
    'censusTractsCalculator'
  )
  get vehicleOccupancy() {
    return this.vehicleOccupancyFromUser;
  }

  set vehicleOccupancy(value) {
    set(this, 'vehicleOccupancyFromUser', value);
  }

  // The percentage values for trip generation per-peak-hour In and Out trip distributions
  @attr({
    defaultValue: () => ({}),
  })
  inOutSplits;

  @attr({
    defaultValue: () => ({}),
  })
  truckInOutSplits;

  @computed(
    'transportationAnalysis.project.{totalUnits,commercialLandUse}',
    'landUse'
  )
  get units() {
    if (this.landUse === 'residential') {
      /* eslint-disable-next-line ember/no-get */
      return get(this, 'transportationAnalysis.project.totalUnits');
    }
    if (this.landUse === 'office') {
      /* eslint-disable-next-line ember/no-get */
      const commercialLandUse = get(
        this,
        'transportationAnalysis.project.commercialLandUse'
      );
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
    'vehicleOccupancy'
  )
  get tripResults() {
    return TripResultsCalculator.create({
      landUse: this.landUse,
      modeSplits: this.modeSplits,
      inOutSplits: this.inOutSplits,
      truckInOutSplits: this.truckInOutSplits,
      vehicleOccupancy: this.vehicleOccupancy,
      /* eslint-disable-next-line ember/no-get */
      project: get(this, 'transportationAnalysis.project'),
      manualModeSplits: this.manualModeSplits,
      temporalModeSplits: this.temporalModeSplits,
      temporalVehicleOccupancy: this.temporalVehicleOccupancy,
      modes: this.activeModes,
      units: this.units,
    });
  }
}
