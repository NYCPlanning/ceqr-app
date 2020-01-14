import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  currentUser: service(),

  actions: {
    saveProject() {
      this.get('project').save();
    },

    logOut() {
      this.get('session').invalidate();
    },
  },
});
