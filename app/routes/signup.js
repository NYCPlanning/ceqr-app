import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  firebaseApp: service(),

  beforeModel: function() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  },

  actions: {
    createUser: function(user) {
      const auth = this.get('firebaseApp').auth();
      auth.createUserWithEmailAndPassword(user.email, user.password).then(() => { 
        this.get('session').fetch();
        this.transitionTo('index'); 
      });
    }
  }
});
