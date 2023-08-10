import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import { action, set } from '@ember/object';

import $ from 'jquery';

import ENV from 'labs-ceqr/config/environment';

export default class SignupFormComponent extends Component {
  tagName = '';
  @service() session;
  @service() router;

  constructor() {
    super(...arguments);
    this.user = {};
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    super.didInsertElement(...arguments);
    $('.ui.form').form({
      fields: {
        email: 'email',
        password: ['minLength[6]', 'empty'],
      },
    });
  }

  @action
  createUser(user) {
    console.info('create user', user);
    fetch(`${ENV.host}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    })
      .then((res) => {
        if (res.status === 201) {
          this.router.transitionTo('signup.email');
        } else if (res.status === 202) {
          this.router.transitionTo('signup.in-review');
        } else {
          set(this, 'error', { message: 'The account could not be created' });
        }
      })
      .catch((err) => set(this, 'error', { message: err }));
  }
}
