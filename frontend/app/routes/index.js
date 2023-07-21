import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.isAuthenticated) {
      this.transitionTo('user.projects');
    } else {
      this.transitionTo('login');
    }
  }
}
