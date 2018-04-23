import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  'ceqr-manual': service(),
  esMsEffectPopupText: computed('ceqr-manual.thresholdEsMsStudents', function() {
    return `Greater than ${this.get('ceqr-manual').thresholdEsMsStudents} elementary and middle school students causes an Indirect Effect`;
  }),
});
