import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  currentUser: service(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser();

    // Not sure this is working
    // test environment doesn't have crisp injected
    if (window.$crisp) {
      window.$crisp.push(['set', 'user:email', [this.currentUser.user.email]]);
    }
  },

  _loadCurrentUser() {
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  },

  actions: {
    error(error) {
      if (error.status === '401') {
        this.session.invalidate();
        this.replaceWith('login');
      }
    },
  },
});
