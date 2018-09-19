import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  session: service(),
  router: service(),

  init() {
    this._super(...arguments);
    this.user = {};
  },
  
  didInsertElement() {
    $('.ui.form').form({
      fields: {
        email: 'email',
        password: 'empty',
      }
    });
  },

  actions: {
    logIn: function(user) {
      const authenticator = 'authenticator:jwt'; // or 'authenticator:jwt'
      this.get('session').authenticate(authenticator, user);
    },
  }
});
