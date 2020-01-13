import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class ProjectAnalysisFrameworkComponent extends Component {
  init() {
    super.init(...arguments);

    this.commercialLandUse = {};
    this.industrialLandUse = {};
    this.parkingLandUse = {};
    this.communityFacilityLandUse = {};
  }

  @computed('project.{totalUnits,seniorUnits}')
  get unitsForPublicSchools() {
    return this.get('project.totalUnits') - this.get('project.seniorUnits');
  }

  @computed('project.affordableUnits')
  get unitsForChildCare() {
    return this.get('project.affordableUnits');
  }

  // Commercial Land Use

  @computed('project.commercialLandUse.@each')
  get totalCommercialSqFt() {
    return this.get('project.commercialLandUse').mapBy('grossSqFt').reduce((a, b) => a + b, 0);
  }

  _commercialLandUseTypes = [{
    name: 'Office',
    type: 'office',
  }, {
    name: 'Regional Retail',
    type: 'regional-retail',
  }, {
    name: 'Local Retail',
    type: 'local-retail',
  }, {
    name: 'Resturant (not fast food)',
    type: 'restaurant',
  }, {
    name: 'Fast Food Restaurant',
    type: 'fast-food',
  }];

  @computed('project.commercialLandUse.@each')
  get commercialUseTypes() {
    const existing = this.get('project.commercialLandUse').mapBy('type');

    return this._commercialLandUseTypes.filter((ut) => !existing.includes(ut.type));
  }

  // Community Facility Land Use

    @computed('project.communityFacilityLandUse.@each')
  get totalCommunityFacilitySqFt() {
    return this.get('project.communityFacilityLandUse').mapBy('grossSqFt').reduce((a, b) => a + b, 0);
  }

    _communityFacilityLandUseTypes = [{
      name: 'General Community Facility',
      type: 'community-facility',
    }];

    @computed('project.communityFacilityLandUse.@each')
    get communityFacilityUseTypes() {
      const existing = this.get('project.communityFacilityLandUse').mapBy('type');

      return this._communityFacilityLandUseTypes.filter((ut) => !existing.includes(ut.type));
    }

    // Industrial Land Use

  @computed('project.industrialLandUse.@each')
    get totalIndustrialSqFt() {
      return this.get('project.industrialLandUse').mapBy('grossSqFt').reduce((a, b) => a + b, 0);
    }

  _industrialLandUseTypes = [{
    name: 'Warehouse Space',
    type: 'warehouse',
  }, {
    name: 'General Industrial',
    type: 'industrial',
  }];

  @computed('project.industrialLandUse.@each')
  get industrialUseTypes() {
    const existing = this.get('project.industrialLandUse').mapBy('type');

    return this._industrialLandUseTypes.filter((ut) => !existing.includes(ut.type));
  }

  // Parking Land Use
  @computed('project.parkingLandUse.@each')
  get totalParkingSpaces() {
    return this.get('project.parkingLandUse').mapBy('spaces').reduce((a, b) => a + b, 0);
  }

  _parkingLandUseTypes = [{
    name: 'Garages',
    type: 'garages',
  }, {
    name: 'Lots',
    type: 'lots',
  }];

  @computed('project.parkingLandUse.@each')
  get parkingUseTypes() {
    const existing = this.get('project.parkingLandUse').mapBy('type');

    return this._parkingLandUseTypes.filter((ut) => !existing.includes(ut.type));
  }

  // Actions

  @action
  addLandUse({ type, grossSqFt }, use) {
    const landuses = this.get(`project.${use}`);
    const useType = this.get(`_${use}Types`).findBy('type', type);

    landuses.pushObject({
      ...useType,
      grossSqFt: parseFloat(grossSqFt),
    });

    this.set(`project.${use}`, landuses);
    this.set(use, {});
  }

  @action
  addParkingLandUse({ type, spaces }, use) {
    const landuses = this.get('project.parkingLandUse');
    const useType = this.get('_parkingLandUseTypes').findBy('type', type);

    landuses.pushObject({
      ...useType,
      spaces: parseFloat(spaces),
    });

    this.set('project.parkingLandUse', landuses);
    this.set(use, {});
  }

  @action
  removeLandUse(type, use) {
    const newArray = this.get(`project.${use}`).rejectBy('type', type);

    this.set(`project.${use}`, newArray);
  }
}
