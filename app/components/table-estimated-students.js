import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({  
  thresholdEsMsStudents: alias('ceqrManual.thresholdEsMsStudents'),
  thresholdHsStudents: alias('ceqrManual.thresholdHsStudents'),

  esMsEffectPopupText: computed('ceqrManual', function() {
    return `Greater than ${this.get('thresholdEsMsStudents')} elementary and middle school students triggers a detailed analysis.`;
  }),
  hsEffectPopupText: computed('ceqrManual', function() {
    return `Greater than ${this.get('thresholdHsStudents')} high school students triggers a detailed analysis.`;
  })
});
