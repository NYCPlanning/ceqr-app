import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  currentUser: service(),

  actions: {
    saveProject: function() {
      this.get('project').save();
    },

    logOut: function() {
      this.get('session').invalidate();
    },
  }
});
