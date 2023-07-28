import Component from '@ember/component';
import { action, set } from '@ember/object';

export default class PublicSchoolsWithActionNewSchoolComponent extends Component {
  tagName = '';
  constructor() {
    super(...arguments);
    this.school = {};
  }

  @action
  addSchool({ name, subdistrict, ps_seats, is_seats, hs_seats }) {
    this.analysis.schoolsWithAction.pushObject({
      ...subdistrict,
      name,
      ps_seats: ps_seats || 0,
      is_seats: is_seats || 0,
      hs_seats: hs_seats || 0,
    });

    this.analysis.save();
    set(this, 'school', {});
  }

  @action
  removeSchool(school) {
    this.analysis.schoolsWithAction.removeObject(school);
    this.analysis.save();
  }
}
