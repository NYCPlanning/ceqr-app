import Component from '@ember/component';
import { action, set } from '@ember/object';
import FutureResidentialDevelopment from '../../../fragments/public-schools/FutureResidentialDevelopment';

export default class PublicSchoolsNoActionAdditionResidentialComponent extends Component {
  tagName = '';
  constructor() {
    super(...arguments);
    this.resdev = {};
  }

  @action
  addResDev({ name, total_units, year, subdistrict }) {
    const residentialDevelopment = FutureResidentialDevelopment.create({
      ...subdistrict,
      name,
      total_units,
      year,
    });

    this.analysis.residentialDevelopments.pushObject(residentialDevelopment);
    this.analysis.save();
    set(this, 'resdev', {});
  }

  @action
  removeResDev(resdev) {
    this.analysis.residentialDevelopments.removeObject(resdev);
    this.analysis.save();
  }
}
