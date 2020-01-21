import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

import $ from 'jquery';

import ENV from 'labs-ceqr/config/environment';

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
        password: ['minLength[6]', 'empty'],
      },
    });
  },

  actions: {
    createUser(user) {
      fetch(`${ENV.host}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      }).then((res) => {
        if (res.status === 201) {
          this.router.transitionTo('signup.email');
        } else if (res.status === 202) {
          this.router.transitionTo('signup.in-review');
        } else {
          this.set('error', { message: 'The account could not be created' });
        }
      }).catch((err) => this.set('error', { message: err }));
    },
  },
});
