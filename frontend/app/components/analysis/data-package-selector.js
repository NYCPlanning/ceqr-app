import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AnalysisDataPackageSelectorComponent extends Component {
  @service store;

  currentPackage = {};
  availablePackages = {};

  @computed('availablePackages', 'currentPackage')
  get newDataAvailable() {
    if (!this.currentPackage) return false;
    return this.availablePackages.any((p) => { return p.releaseDate > this.currentPackage.get('releaseDate') });
  }

  @action
  changeDataPackage(dp) {
    this.changeDataPackageAction(dp);
  }
}
