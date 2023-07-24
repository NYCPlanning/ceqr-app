import EmberObject, { computed } from '@ember/object';

export default class FutureResidentialDevelopmentFragment extends EmberObject {
  @computed('multipliers.ps', 'total_units', function () {
    return Math.round(this.total_units * this.multipliers.ps);
  })
  ps_students;

  @computed('multipliers.is', 'total_units', function () {
    return Math.round(this.total_units * this.multipliers.is);
  })
  is_students;

  @computed('multipliers.hs', 'total_units', function () {
    return Math.round(this.total_units * this.multipliers.hs);
  })
  hs_students;
}
