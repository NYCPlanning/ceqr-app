import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';
import fetch from 'fetch';
import $ from 'jquery';

import ENV from 'labs-ceqr/config/environment';

export default class LoginFormComponent extends Component {
  tagName = '';
  @service() session;
  @service() router;
  @service() flashMessages;

  constructor() {
    super(...arguments);
    this.login = {};
  }

  didReceiveAttrs() {
    super.didReceiveAttrs();
    super.didReceiveAttrs();
    if (this.validate) {
      fetch(`${ENV.host}/auth/v1/validate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.validate }),
      })
        .catch((err) => set(this, 'error', { message: err }))
        .then((res) => {
          if (res.status === 200) {
            this.flashMessages.add({
              message: 'Your account has been validated. Login to access.',
              type: 'success',
              sticky: true,
            });
          } else {
            this.flashMessages.add({
              message: 'Could not activate account. Invalid token.',
              type: 'error',
              sticky: true,
            });
          }
        });
    }
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    super.didInsertElement(...arguments);
    $('.ui.login').form({
      fields: {
        email: 'email',
        password: 'empty',
      },
    });
  }

  @action
  logIn(user) {
    const authenticator = 'authenticator:jwt'; // or 'authenticator:jwt'
    this.session.authenticate(authenticator, user).catch((error) => {
      const { message } = JSON.parse(error.text);
      set(this, 'error', { message });
    });
  }
}
