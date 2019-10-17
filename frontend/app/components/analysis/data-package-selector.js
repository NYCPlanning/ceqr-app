import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class AnalysisDataPackageSelectorComponent extends Component {
  @service store;

  // didReceiveAttrs() {
  //   this._super(...arguments);
  //   const allPackages = this.store.query('data-package', { filter: { package: this.currentPackage.get('package') } });
  //   this.set('availablePackages', allPackages.without(this.currentPackage));
  // }

  @computed('currentPackage')
  get availablePackages() {
    const allPackages = this.store.query('data-package', { filter: { package: this.currentPackage.get('package') } });
    return allPackages.without(this.currentPackage);
  }

  @computed('currentPackage', 'availablePackages')
  get selectedVersion() {
    return this.currentPackage.get('version');
  }

  @computed('availablePackages', 'currentPackage')
  get newDataAvailable() {
    if (!this.currentPackage) return false;
    return this.availablePackages.any((p) => { return p.releaseDate > this.currentPackage.get('releaseDate') });
  }

  @action
  changeDataPackage(dp) {
    this.updateDataPackageAction(dp);
  }
}
