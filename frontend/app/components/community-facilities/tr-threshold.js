import Component from '@ember/component';
import { computed } from '@ember/object';
import boroughToAbbr from 'labs-ceqr/utils/boroughToAbbr';

export default class CommunityFacilitiesTrThresholdComponent extends Component {
  tagName = 'tr';

  @computed('analysis.childCareThresholds', 'borough')
  get childCareThreshold() {
    return this.analysis.get(
      `childCareThresholds.${boroughToAbbr(this.borough)}`
    );
  }

  @computed('analysis.libraryThresholds', 'borough')
  get libraryThreshold() {
    return this.analysis.get(
      `libraryThresholds.${boroughToAbbr(this.borough)}`
    );
  }

  @computed('borough', 'analysis.project.borough')
  get isProjectBorough() {
    return this.borough === this.analysis.get('project.borough');
  }

  @computed('analysis.potentialChildCareImpact', 'isProjectBorough')
  get childCareImpact() {
    return (
      this.analysis.get('potentialChildCareImpact') && this.isProjectBorough
    );
  }

  @computed('analysis.potentialLibraryImpact', 'isProjectBorough')
  get libraryImpact() {
    return this.analysis.get('potentialLibraryImpact') && this.isProjectBorough;
  }

  @computed('isProjectBorough', 'libraryImpact')
  get libraryClass() {
    if (this.isProjectBorough) {
      return this.libraryImpact ? 'warning' : 'active';
    }
    return null;
  }

  @computed('isProjectBorough', 'childCareImpact')
  get childCareClass() {
    if (this.isProjectBorough) {
      return this.childCareImpact ? 'warning' : 'active';
    }
    return null;
  }
}
