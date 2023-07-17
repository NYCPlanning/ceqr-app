import DS from 'ember-data';
import { computed } from '@ember/object';

const { Model, belongsTo } = DS;

export default class CommunityFacilitiesAnalysisModel extends Model {
  @belongsTo project;

  @computed('potentialLibraryImpact', 'potentialChildCareImpact')
  get detailedAnalysis() {
    return this.potentialLibraryImpact || this.potentialChildCareImpact;
  }

  @computed('childCareThresholds', 'project.{affordableUnits,borough}')
  get potentialChildCareImpact() {
    return (
      this.project.get('affordableUnits') >=
      this.childCareThresholds[this.project.get('boroAbbr')]
    );
  }

  @computed('libraryThresholds', 'project.{borough,totalUnits}')
  get potentialLibraryImpact() {
    return (
      this.project.get('totalUnits') >=
      this.libraryThresholds[this.project.get('boroAbbr')]
    );
  }

  childCareThresholds = {
    bx: 141,
    bk: 110,
    mn: 170,
    qn: 139,
    si: 217,
  };

  libraryThresholds = {
    bx: 682,
    bk: 734,
    mn: 901,
    qn: 622,
    si: 652,
  };
}
