import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  session: service(),
  router: service(),
  firebaseApp: service(),

  init() {
    this._super(...arguments);
    this.user = {};
  },

  didInsertElement() {
    $('.ui.form').form({
      fields: {
        email: 'email',
        password: ['minLength[6]', 'empty'],
      }
    });
  },
  
  actions: {
    // createUser: function(user) {
    //   const auth = this.get('firebaseApp').auth();
    //   auth.createUserWithEmailAndPassword(user.email, user.password).then(() => { 
    //     this.get('session').fetch();
    //     this.get('router').transitionTo('index'); 
    //   }).catch((e) =>
    //     this.set('error', e)
    //   );
    // }
  }
});
