import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.school = {};
  },

  actions: {
    addSchool({ name, subdistrict, ps_seats, is_seats, hs_seats }) {
      this.get('analysis.schoolsWithAction').pushObject({
        ...subdistrict,
        name,
        ps_seats: ps_seats || 0,
        is_seats: is_seats || 0,
        hs_seats: hs_seats || 0
      });

      this.get('analysis').save();
      this.set('school', {});
    },
    removeSchool(school) {
      this.get('analysis.schoolsWithAction').removeObject(school);
      this.get('analysis').save();
    }
  }
});
