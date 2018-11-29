import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel(transition) {
    if (this.session.isAuthenticated || !transition.queryParams.token) {
      this.transitionTo('index')
    }
  },

  model(params) {
    return { id: params.id }
  }
});
