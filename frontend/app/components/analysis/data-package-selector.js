import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class AnalysisDataPackageSelectorComponent extends Component {
  @service store;

  @computed('dataPackageType')
  get availablePackages() {
    const packages = this.store.query('data-package', { filter: { package: this.dataPackageType } });
    console.log(packages);
    console.log(this.currentPackage);
    
    return packages.without(this.currentPackage);
  }

  @computed('availablePackages', 'currentPackage')
  get newDataAvailable() {
    if (!this.currentPackage) return false;
    return this.availablePackages.any((p) => { return p.releaseDate > this.currentPackage.releaseDate });
  }

  @action
  changeDataPackage(dp) {
    this.updateDataPackageAction(dp);
  }
}
