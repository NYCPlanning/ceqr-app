import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import $ from 'jquery';

import ENV from 'labs-ceqr/config/environment';

export default Component.extend({
  router: service(),

  didInsertElement() {
    this._super(...arguments);
    $('.ui.form').form({
      fields: {
        password: ['minLength[6]', 'empty'],
      },
    });
  },

  actions: {
    resetPassword(password) {
      fetch(`${ENV.host}/auth/v1/password-reset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token: this.token }),
      }).then((res) => {
        if (res.status === 200) {
          this.flashMessages.add({
            message: 'Password reset successfully.',
            type: 'success',
            sticky: true,
          });
          this.router.transitionTo('login');
        } else if (res.status === 422) {
          res.json().then(({ message }) => this.set('error', { message }));
        }
      });
    },
  },
});
