import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel: function() {
    if (this.get('session').isAuthenticated) {
      this.transitionTo('index');
    }
  },

  actions: {
    logIn: function(user) {
      this.get('session').open('firebase', {
        provider: 'password',
        email: user.email,
        password: user.password
      }).then(() => {
        this.transitionTo('user.projects');
      });
    },
  }
});
