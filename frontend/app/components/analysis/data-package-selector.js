import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';

export default class AnalysisDataPackageSelectorComponent extends Component {
  @service store;


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
