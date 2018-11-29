import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.resdev = {};
  },
  
  actions: {
    addResDev({ name, total_units, year, subdistrict }) {      
      let multipliers = this.get('analysis.currentMultiplier');
      
      this.get('analysis.futureResidentialDev').pushObject({
        ...subdistrict,
        name,
        total_units,
        year,
        ps_students: Math.round(total_units * multipliers.ps),
        is_students: Math.round(total_units * multipliers.is),
        hs_students: Math.round(total_units * multipliers.hs)
      });
      this.get('analysis').save();
      this.set('resdev', {});
    },
    removeResDev(resdev) {
      this.get('analysis.futureResidentialDev').removeObject(resdev);
      this.get('analysis').save();
    },
  }
});
