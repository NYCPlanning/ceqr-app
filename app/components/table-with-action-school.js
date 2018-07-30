import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.school = {};
  },

  actions: {
    addSchool({ name, subdistrict, ps_seats, is_seats, hs_seats }) {
      
      
      this.get('project.schoolsWithAction').pushObject({
        ...subdistrict,
        name,
        ps_seats,
        is_seats,
        hs_seats
      });

      this.get('project').save();
      this.set('school', {});
    },
    removeSchool(school) {
      this.get('project.schoolsWithAction').removeObject(school);
      this.get('project').save();
    }
  }
});
