import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  actions: {
    saveProject: function() {
      this.get('project').save();
    },
  }
});
