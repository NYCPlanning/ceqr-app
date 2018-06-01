import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.resdev = {};
  },
  
  actions: {
    addResDev({ name, total_units, year, subdistrict }) {      
      let multipliers = this.get('project.studentMultipliers');
      
      this.get('project.futureResidentialDev').pushObject({
        ...subdistrict,
        name,
        total_units,
        year,
        ps_students: Math.round(total_units * multipliers.es),
        is_students: Math.round(total_units * multipliers.ms),
        hs_students: Math.round(total_units * multipliers.hs)
      });
      this.get('project').save();
      this.set('resdev', {});
    },
    removeResDev(resdev) {
      this.get('project.futureResidentialDev').removeObject(resdev);
      this.get('project').save();
    },
  }
});
