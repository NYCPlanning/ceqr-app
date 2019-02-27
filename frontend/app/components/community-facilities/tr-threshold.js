import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

export default class CommunityFacilitiesTrThresholdComponent extends Component {
  tagName = 'tr'

  @computed('analysis.childCareThresholds')
  get childCareThreshold() {
    return this.analysis.get(`childCareThresholds.${this.boroAbbr}`);
  }

  @computed('analysis.libraryThresholds')
  get libraryThreshold() {
    return this.analysis.get(`libraryThresholds.${this.boroAbbr}`);
  }

  @computed('borough', 'analysis.project.borough')
  get isProjectBorough() {
    return this.borough === this.analysis.get('project.borough');
  }

  @computed('analysis.potentialChildCareImpact', 'isProjectBorough')
  get childCareImpact() {
    return this.analysis.get('potentialChildCareImpact') && this.isProjectBorough;
  }

  @computed('analysis.potentialLibraryImpact', 'isProjectBorough')
  get libraryImpact() {
    return this.analysis.get('potentialLibraryImpact') && this.isProjectBorough;
  }

  @computed('isProjectBorough', 'libraryImpact')
  get libraryClass() {
    if (this.isProjectBorough) {
      return this.libraryImpact ? "warning" : "active";
    } else {
      return null;
    }
  }

  @computed('isProjectBorough', 'childCareImpact')
  get childCareClass() {
    if (this.isProjectBorough) {
      return this.childCareImpact ? "warning" : "active";
    } else {
      return null;
    }
  }
}
