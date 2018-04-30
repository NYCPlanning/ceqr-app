import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';

export default Service.extend({
  store: service(),
  manual: null,

  init() {
    this._super(...arguments);
    this.set('manual', this.get('store').findRecord('ceqr-manual', 'march-2014'))
  },

  minResidentialUnits: alias('manual.minResidentialUnits'),
  studentMultipliers: alias('manual.studentMultipliers'),
  thresholdEsMsStudents: alias('manual.thresholdEsMsStudents'),
  thresholdHsStudents: alias('manual.thresholdHsStudents'),

  minResidentialUnitsFor(boro) {
    if (isEmpty(boro) || isEmpty(this.get('minResidentialUnits'))) return {es: 0, hs: 0};
    return this.get('minResidentialUnits').findBy('name', boro);
  },

  studentMultipliersFor(boro) {
    if (isEmpty(boro) || isEmpty(this.get('studentMultipliers'))) return {es: 0, ms: 0, hs: 0};
    return this.get('studentMultipliers').findBy('name', boro);
  }
});
