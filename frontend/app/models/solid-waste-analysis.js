import DS from 'ember-data';
const { Model } = DS;
import { belongsTo } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

export default class SolidWasteAnalysisModel extends Model {
  @belongsTo project;

  @computed('project.totalUnits', 'totalCommercialSqFt')
  get describeStorage() {
    return (this.hasFastFood || this.totalCommercialSqFt > 100000);
  }

  @computed('commercialLanduse.[]')
  get totalCommercialSqFt() {
    return this.get('project.commercialLandUse').reduce((a, c) => a + c.grossSqFt, 0);
  }
}
