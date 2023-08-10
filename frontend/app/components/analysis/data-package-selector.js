import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AnalysisDataPackageSelectorComponent extends Component {
  tagName = '';
  @service store;

  currentPackage = {};

  availablePackages = {};

  @computed('availablePackages', 'currentPackage')
  get newDataAvailable() {
    if (!this.currentPackage) return false;
    return this.availablePackages.any(
      (p) => p.releaseDate > this.currentPackage.get('releaseDate')
    );
  }

  @action
  changeDataPackage(dp) {
    console.info('changeDataPackage in analysis', dp);
    this.changeDataPackageAction(dp);
  }
}
