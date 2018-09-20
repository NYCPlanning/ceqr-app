import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  session: service(),
  router: service(),

  init() {
    this._super(...arguments);
    this.login = {};
    this.newUser = {};
  },
  
  didInsertElement() {
    $('.ui.login').form({
      fields: {
        email: 'email',
        password: 'empty',
      }
    });

    $('.ui.signup').form({
      fields: {
        email: 'email',
        password: ['minLength[6]', 'empty'],
      }
    });
  },

  actions: {
    logIn: function(user) {
      const authenticator = 'authenticator:jwt'; // or 'authenticator:jwt'
      this.get('session').authenticate(authenticator, user).catch((error) => {
        const message = JSON.parse(error.text).message;
        this.set('error', { message })
      })
    },

    // createUser: function(user) {
    //   fetch(`https://${cartoDomain}/api/v1/map`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(params),
    //   }).then()

    //   // const auth = this.get('firebaseApp').auth();
    //   // auth.createUserWithEmailAndPassword(user.email, user.password).then(() => { 
    //   //   this.get('session').fetch();
    //   //   this.get('router').transitionTo('index'); 
    //   // }).catch((e) =>
    //   //   this.set('error', e)
    //   // );
    // }
  }
});
