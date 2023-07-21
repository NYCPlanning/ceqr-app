import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @service currentUser;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
    return this._loadCurrentUser();
  }

  sessionAuthenticated() {
    super.sessionAuthenticated(...arguments);
    this._loadCurrentUser();

    // Not sure this is working
    // test environment doesn't have crisp injected
    if (window.$crisp) {
      window.$crisp.push(['set', 'user:email', [this.currentUser.user.email]]);
    }
  }

  _loadCurrentUser() {
    return this.currentUser.load().catch(() => this.session.invalidate());
  }

  @action
  error(error) {
    if (error.status === '401') {
      this.session.invalidate();
      this.replaceWith('login');
    }
  }
}
