import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  analysis: service(),
  analysisThreshold: computed('analysis', function() {
    return this.get('analysis').analysisThreshold();
  }),
});
