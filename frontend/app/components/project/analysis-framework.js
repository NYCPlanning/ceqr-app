import Component from '@ember/component';
import { action, computed, get, set } from '@ember/object';

export default class ProjectAnalysisFrameworkComponent extends Component {
  tagName = '';
  constructor() {
    super(...arguments);

    this.commercialLandUse = {};
    this.industrialLandUse = {};
    this.parkingLandUse = {};
    this.communityFacilityLandUse = {};
  }

  @computed('project.{totalUnits,seniorUnits}')
  get unitsForPublicSchools() {
    /* eslint-disable-next-line ember/no-get */
    return get(this, 'project.totalUnits') - get(this, 'project.seniorUnits');
  }

  @computed('project.affordableUnits')
  get unitsForChildCare() {
    /* eslint-disable-next-line ember/no-get */
    return get(this, 'project.affordableUnits');
  }

  // Commercial Land Use

  @computed('project.commercialLandUse.[]')
  get totalCommercialSqFt() {
    /* eslint-disable-next-line ember/no-get */
    return get(this, 'project.commercialLandUse')
      .mapBy('grossSqFt')
      .reduce((a, b) => a + b, 0);
  }

  _commercialLandUseTypes = [
    {
      name: 'Office',
      type: 'office',
    },
    {
      name: 'Regional Retail',
      type: 'regional-retail',
    },
    {
      name: 'Local Retail',
      type: 'local-retail',
    },
    {
      name: 'Resturant (not fast food)',
      type: 'restaurant',
    },
    {
      name: 'Fast Food Restaurant',
      type: 'fast-food',
    },
  ];

  @computed('_commercialLandUseTypes', 'project.commercialLandUse.[]')
  get commercialUseTypes() {
    /* eslint-disable-next-line ember/no-get */
    const existing = get(this, 'project.commercialLandUse').mapBy('type');

    return this._commercialLandUseTypes.filter(
      (ut) => !existing.includes(ut.type)
    );
  }

  // Community Facility Land Use

  @computed('project.communityFacilityLandUse.[]')
  get totalCommunityFacilitySqFt() {
    /* eslint-disable-next-line ember/no-get */
    return get(this, 'project.communityFacilityLandUse')
      .mapBy('grossSqFt')
      .reduce((a, b) => a + b, 0);
  }

  _communityFacilityLandUseTypes = [
    {
      name: 'General Community Facility',
      type: 'community-facility',
    },
  ];

  @computed(
    '_communityFacilityLandUseTypes',
    'project.communityFacilityLandUse.[]'
  )
  get communityFacilityUseTypes() {
    /* eslint-disable-next-line ember/no-get */
    const existing = get(this, 'project.communityFacilityLandUse').mapBy(
      'type'
    );

    return this._communityFacilityLandUseTypes.filter(
      (ut) => !existing.includes(ut.type)
    );
  }

  // Industrial Land Use

  @computed('project.industrialLandUse.[]')
  get totalIndustrialSqFt() {
    /* eslint-disable-next-line ember/no-get */
    return get(this, 'project.industrialLandUse')
      .mapBy('grossSqFt')
      .reduce((a, b) => a + b, 0);
  }

  _industrialLandUseTypes = [
    {
      name: 'Warehouse Space',
      type: 'warehouse',
    },
    {
      name: 'General Industrial',
      type: 'industrial',
    },
  ];

  @computed('_industrialLandUseTypes', 'project.industrialLandUse.[]')
  get industrialUseTypes() {
    /* eslint-disable-next-line ember/no-get */
    const existing = get(this, 'project.industrialLandUse').mapBy('type');

    return this._industrialLandUseTypes.filter(
      (ut) => !existing.includes(ut.type)
    );
  }

  // Parking Land Use
  @computed('project.parkingLandUse.[]')
  get totalParkingSpaces() {
    /* eslint-disable-next-line ember/no-get */
    return get(this, 'project.parkingLandUse')
      .mapBy('spaces')
      .reduce((a, b) => a + b, 0);
  }

  _parkingLandUseTypes = [
    {
      name: 'Garages',
      type: 'garages',
    },
    {
      name: 'Lots',
      type: 'lots',
    },
  ];

  @computed('_parkingLandUseTypes', 'project.parkingLandUse.[]')
  get parkingUseTypes() {
    /* eslint-disable-next-line ember/no-get */
    const existing = get(this, 'project.parkingLandUse').mapBy('type');

    return this._parkingLandUseTypes.filter(
      (ut) => !existing.includes(ut.type)
    );
  }

  // Actions

  @action
  addLandUse({ type, grossSqFt }, use) {
    /* eslint-disable-next-line ember/no-get */
    const landuses = get(this, `project.${use}`);
    /* eslint-disable-next-line ember/no-get */
    const useType = get(this, `_${use}Types`).findBy('type', type);

    landuses.pushObject({
      ...useType,
      grossSqFt: parseFloat(grossSqFt),
    });

    set(this, `project.${use}`, landuses);
    set(this, use, {});
  }

  @action
  addParkingLandUse({ type, spaces }, use) {
    /* eslint-disable-next-line ember/no-get */
    const landuses = get(this, 'project.parkingLandUse');
    const useType = this._parkingLandUseTypes.findBy('type', type);

    landuses.pushObject({
      ...useType,
      spaces: parseFloat(spaces),
    });

    set(this, 'project.parkingLandUse', landuses);
    set(this, use, {});
  }

  @action
  removeLandUse(type, use) {
    /* eslint-disable-next-line ember/no-get */
    const newArray = get(this, `project.${use}`).rejectBy('type', type);

    set(this, `project.${use}`, newArray);
  }
}
