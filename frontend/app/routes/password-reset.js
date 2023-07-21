import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PasswordResetRoute extends Route {
  @service() session;

  beforeModel(transition) {
    if (this.session.isAuthenticated || !transition.to.queryParams.token) {
      this.transitionTo('index');
    }
  }

  model(params) {
    return { id: params.id };
  }
}
