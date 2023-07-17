import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  thresholdPsIsStudents: alias('analysis.multipliers.thresholdPsIsStudents'),
  thresholdHsStudents: alias('analysis.multipliers.thresholdHsStudents'),

  esMsEffectPopupText: computed('thresholdPsIsStudents', function () {
    return `Greater than ${this.thresholdPsIsStudents} elementary and middle school students triggers a detailed analysis.`;
  }),
  hsEffectPopupText: computed('thresholdHsStudents', function () {
    return `Greater than ${this.thresholdHsStudents} high school students triggers a detailed analysis.`;
  }),
});
