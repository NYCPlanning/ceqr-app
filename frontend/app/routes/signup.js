import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SignupRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.isAuthenticated) {
      this.transitionTo('index');
    }
  }
}
