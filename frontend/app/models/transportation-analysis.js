import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed, get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { MODES } from 'labs-ceqr/utils/censusTractVariableForMode';
import TripResultsTotalsCalculator from '../calculators/transportation/trip-results-totals';

export default class TransportationAnalysisModel extends Model {
  ready() {
    // Default modesForAnalysis
    if (Object.keys(this.modesForAnalysis).length === 0) {
      set(this, 'modesForAnalysis', [
        'auto',
        'taxi',
        'bus',
        'subway',
        'walk',
        'railroad',
      ]);
    }
  }

  @belongsTo project;

  @hasMany('transportationPlanningFactor') transportationPlanningFactors;

  // Attributes
  @attr('number') trafficZone;

  // the geoids of REQUIRED census tracts in study selection; determined by bbl intersect
  @attr({ defaultValue: () => [] }) requiredCensusTractsSelection;

  // the geoids of additional user-defined study selection
  @attr({ defaultValue: () => [] }) censusTractsSelection;

  // the computed centroid of the study selection
  @attr({ defaultValue: () => {} }) censusTractsCentroid;

  // array of transport modes being analyzed
  @attr({ defaultValue: () => [] }) modesForAnalysis;

  @computed('modesForAnalysis.[]')
  get activeModes() {
    return MODES.filter((m) => this.modesForAnalysis.includes(m));
  }

  @computed('modesForAnalysis.[]')
  get inactiveModes() {
    return MODES.reject((m) => this.modesForAnalysis.includes(m));
  }

  // Detailed Analysis trigger
  @computed('hasFastFoodGte2500', 'sumOfRatios', 'sumOfRatiosOver1')
  get detailedAnalysis() {
    return this.hasFastFoodGte2500 || this.sumOfRatiosOver1;
  }

  // Sum of Ratios
  @computed(
    'residentialUnitsRatio',
    'officeSqFtRatio',
    'regionalRetailSqFtRatio',
    'localRetailSqFtRatio',
    'restaurantSqFtRatio',
    'communityFacilitySqFtRatio',
    'offStreetParkingSpacesRatio'
  )
  get sumOfRatios() {
    return (
      this.residentialUnitsRatio +
      this.officeSqFtRatio +
      this.regionalRetailSqFtRatio +
      this.localRetailSqFtRatio +
      this.restaurantSqFtRatio +
      this.communityFacilitySqFtRatio +
      this.offStreetParkingSpacesRatio
    );
  }

  // Sum of Ratios boolean
  @computed('sumOfRatios')
  get sumOfRatiosOver1() {
    return this.sumOfRatios > 1;
  }

  // Fast Food boolean
  @computed('fastFoodSqFt')
  get hasFastFoodGte2500() {
    return this.fastFoodSqFt >= 2500;
  }

  // Residential units
  @alias('project.totalUnits') residentialUnits;

  @computed('residentialUnits')
  get residentialUnitsRatio() {
    return this.ratioFor('residentialUnits');
  }

  // Office sq ft
  @computed('project.commercialLandUse.[]')
  get officeSqFt() {
    const type = get(this, 'project.commercialLandUse').findBy(
      'type',
      'office'
    );
    return type ? type.grossSqFt : 0;
  }

  @computed('officeSqFt')
  get officeSqFtRatio() {
    return this.ratioFor('officeSqFt');
  }

  // Regional Retail sq ft
  @computed('project.commercialLandUse.[]')
  get regionalRetailSqFt() {
    const type = get(this, 'project.commercialLandUse').findBy(
      'type',
      'regional-retail'
    );
    return type ? type.grossSqFt : 0;
  }

  @computed('regionalRetailSqFt')
  get regionalRetailSqFtRatio() {
    return this.ratioFor('regionalRetailSqFt');
  }

  // Local Retail sq ft
  @computed('project.commercialLandUse.[]')
  get localRetailSqFt() {
    const type = get(this, 'project.commercialLandUse').findBy(
      'type',
      'local-retail'
    );
    return type ? type.grossSqFt : 0;
  }

  @computed('localRetailSqFt')
  get localRetailSqFtRatio() {
    return this.ratioFor('localRetailSqFt');
  }

  // Restaurant sq ft
  @computed('project.commercialLandUse.[]')
  get restaurantSqFt() {
    const resturants = get(this, 'project.commercialLandUse').filter(
      (r) => r.type === 'restaurant' || r.type === 'fast-food'
    );
    return resturants.reduce((a, r) => a + r.grossSqFt, 0);
  }

  @computed('restaurantSqFt')
  get restaurantSqFtRatio() {
    return this.ratioFor('restaurantSqFt');
  }

  // Fast food sq ft
  // Here reduce() is used to be defensive, in case the commercialLandUse
  // array can have multiple objects of type `fast-food`. However the "New Project" UI
  // currently suggests only one fast-food land use can be created per project.
  @computed('project.commercialLandUse.[]')
  get fastFoodSqFt() {
    return get(this, 'project.commercialLandUse')
      .filter((landUse) => landUse.type === 'fast-food')
      .reduce(
        (landUseTotalSqFt, curLandUse) =>
          landUseTotalSqFt + curLandUse.grossSqFt,
        0
      );
  }

  // Community Facility sq ft
  @computed('project.communityFacilityLandUse.[]')
  get communityFacilitySqFt() {
    const type = get(this, 'project.communityFacilityLandUse').findBy(
      'type',
      'community-facility'
    );
    return type ? type.grossSqFt : 0;
  }

  @computed('communityFacilitySqFt')
  get communityFacilitySqFtRatio() {
    return this.ratioFor('communityFacilitySqFt');
  }

  // Off Street Parking spaces
  @computed('project.parkingLandUse.[]')
  get offStreetParkingSpaces() {
    return get(this, 'project.parkingLandUse').reduce(
      (a, p) => a + p.spaces,
      0
    );
  }

  @computed('offStreetParkingSpaces')
  get offStreetParkingSpacesRatio() {
    return this.ratioFor('offStreetParkingSpaces');
  }

  @computed(
    'modesForAnalysis',
    'transportationPlanningFactors.@each.tripResults'
  )
  get tripTotals() {
    return TripResultsTotalsCalculator.create({
      tripResults: this.transportationPlanningFactors.map(
        (factor) => factor.tripResults
      ),
      modes: this.modesForAnalysis,
    });
  }

  trafficZoneThresholds = {
    residentialUnits: {
      zone1: 240,
      zone2: 200,
      zone3: 200,
      zone4: 200,
      zone5: 100,
    },
    officeSqFt: {
      zone1: 115000,
      zone2: 100000,
      zone3: 100000,
      zone4: 75000,
      zone5: 40000,
    },
    regionalRetailSqFt: {
      zone1: 30000,
      zone2: 20000,
      zone3: 20000,
      zone4: 10000,
      zone5: 10000,
    },
    localRetailSqFt: {
      zone1: 15000,
      zone2: 15000,
      zone3: 15000,
      zone4: 10000,
      zone5: 10000,
    },
    restaurantSqFt: {
      zone1: 20000,
      zone2: 20000,
      zone3: 10000,
      zone4: 10000,
      zone5: 10000,
    },
    communityFacilitySqFt: {
      zone1: 25000,
      zone2: 25000,
      zone3: 25000,
      zone4: 15000,
      zone5: 15000,
    },
    offStreetParkingSpaces: {
      zone1: 85,
      zone2: 85,
      zone3: 80,
      zone4: 60,
      zone5: 60,
    },
  };

  thresholdFor(type) {
    const zone = `zone${this.trafficZone}`;
    return this.trafficZoneThresholds[type]?.[zone];
  }

  ratioFor(type) {
    return this[type] / this.thresholdFor(type);
  }
}
