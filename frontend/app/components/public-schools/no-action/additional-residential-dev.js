import Component from '@ember/component';
import FutureResidentialDevelopment from '../../../fragments/public-schools/FutureResidentialDevelopment';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.resdev = {};
  },

  actions: {
    addResDev({
      name, total_units, year, subdistrict,
    }) {
      const residentialDevelopment = FutureResidentialDevelopment.create({
        ...subdistrict,
        name,
        total_units,
        year,
      });

      this.get('analysis.residentialDevelopments').pushObject(residentialDevelopment);
      this.analysis.save();
      this.set('resdev', {});
    },
    removeResDev(resdev) {
      this.get('analysis.residentialDevelopments').removeObject(resdev);
      this.analysis.save();
    },
  },
});
