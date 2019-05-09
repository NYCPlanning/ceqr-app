import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import $ from 'jquery';

import ENV from 'labs-ceqr/config/environment';

export default Component.extend({
  session: service(),
  router: service(),
  flashMessages: service(),

  init() {
    this._super(...arguments);
    this.login = {};
  },

  didReceiveAttrs() {
    if (this.validate) {
      fetch(`${ENV.host}auth/v1/validate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.validate }),
      }).catch((err) =>
        this.set('error', { message: err })
      ).then((res) => {
        if (res.status === 200) {
          this.flashMessages.add({
            message: 'Your account has been validated. Login to access.',
            type: 'success',
            sticky: true,
          })
        } else {
          this.flashMessages.add({
            message: 'Could not activate account. Invalid token.',
            type: 'error',
            sticky: true,
          })
        }
      })
    }
  },

  didInsertElement() {
    $('.ui.login').form({
      fields: {
        email: 'email',
        password: 'empty',
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
  }
});
