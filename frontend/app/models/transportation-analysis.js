import DS from 'ember-data';
const { Model } = DS;
import { attr, belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';

export default class TransportationAnalysisModel extends Model {    
  @belongsTo project;

  // Attributes
  @attr('number') trafficZone;
  // the geoids of REQUIRED census tracts in study selection; determined by bbl intersect
  @attr({defaultValue: () => []}) requiredJtwStudySelection;
  // the geoids of additional user-defined study selection
  @attr({defaultValue: () => []}) jtwStudySelection;

  // Detailed Analysis trigger
  @computed(
    'sumOfRatios',
    'hasFastFood'
  )
  get detailedAnalysis() {
    return (
      this.hasFastFood ||
      this.hasCommunityFacility ||
      this.sumOfRatiosOver1
    )
  }

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
    )
  }

  // Fast Food boolean
  @computed('project.commercialLandUse.[]')
  get hasFastFood() {
    return !!this.get('project.commercialLandUse').findBy('type', 'fast-food');
  }

  // Community Facilities boolean
  @computed('project.communityFacilityLandUse.[]')
  get hasCommunityFacility() {
    return !!this.get('project.communityFacilityLandUse').length;
  }

  // Sum of Ratios boolean
  @computed('sumOfRatios')
  get sumOfRatiosOver1() {
    return this.sumOfRatios > 1;
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
    const type = this.get('project.commercialLandUse').findBy('type', 'office');
    return type ? type.grossSqFt : 0;
  }
  @computed('officeSqFt')
  get officeSqFtRatio() {
    return this.ratioFor('officeSqFt');
  }

  // Regional Retail sq ft
  @computed('project.commercialLandUse.[]')
  get regionalRetailSqFt() {
    const type = this.get('project.commercialLandUse').findBy('type', 'regional-retail');
    return type ? type.grossSqFt : 0;
  }
  @computed('regionalRetailSqFt')
  get regionalRetailSqFtRatio() {
    return this.ratioFor('regionalRetailSqFt');
  }

  // Local Retail sq ft
  @computed('project.commercialLandUse.[]')
  get localRetailSqFt() {
    const type = this.get('project.commercialLandUse').findBy('type', 'local-retail');
    return type ? type.grossSqFt : 0;
  }
  @computed('localRetailSqFt')
  get localRetailSqFtRatio() {
    return this.ratioFor('localRetailSqFt');
  }

  // Restaurant sq ft
  @computed('project.commercialLandUse.[]')
  get restaurantSqFt() {
    const resturants = this.get('project.commercialLandUse').filter((r) => r.type === 'restaurant' || r.type === 'fast-food');
    return resturants.reduce((a, r) => a + r.grossSqFt, 0);
  }
  @computed('restaurantSqFt')
  get restaurantSqFtRatio() {
    return this.ratioFor('restaurantSqFt');
  }

  // Community Facility sq ft
  @computed('project.communityFacilityLandUse.[]')
  get communityFacilitySqFt() {
    const type = this.get('project.communityFacilityLandUse').findBy('type', 'community-facility');
    return type ? type.grossSqFt : 0;
  }
  @computed('communityFacilitySqFt')
  get communityFacilitySqFtRatio() {
    return this.ratioFor('communityFacilitySqFt');
  }

  // Off Street Parking spaces
  @computed('project.parkingLandUse.[]')
  get offStreetParkingSpaces() {
    return this.get('project.parkingLandUse').reduce((a, p) => a + p.spaces, 0);
  }
  @computed('offStreetParkingSpaces')
  get offStreetParkingSpacesRatio() {
    return this.ratioFor('offStreetParkingSpaces');
  }

  trafficZoneThresholds = {
    residentialUnits: {
      zone1: 240,
      zone2: 200,
      zone3: 200,
      zone4: 200,
      zone5: 200
    },
    officeSqFt: {
      zone1: 115000,
      zone2: 100000,
      zone3: 100000,
      zone4: 75000,
      zone5: 40000
    } ,
    regionalRetailSqFt: {
      zone1: 30000,
      zone2: 20000,
      zone3: 20000,
      zone4: 10000,
      zone5: 10000
    },
    localRetailSqFt: {
      zone1: 15000,
      zone2: 15000,
      zone3: 15000,
      zone4: 10000,
      zone5: 10000
    },
    restaurantSqFt: {
      zone1: 20000,
      zone2: 20000,
      zone3: 10000,
      zone4: 10000,
      zone5: 10000
    },
    communityFacilitySqFt: {
      zone1: 25000,
      zone2: 25000,
      zone3: 25000,
      zone4: 15000,
      zone5: 15000
    },
    offStreetParkingSpaces: {
      zone1: 85,
      zone2: 85,
      zone3: 80,
      zone4: 60,
      zone5: 60
    }
  };

  thresholdFor(type) {
    return this.get(`trafficZoneThresholds.${type}.zone${this.trafficZone}`);
  }

  ratioFor(type) {
    return this.get(type) / this.thresholdFor(type);
  }
}
