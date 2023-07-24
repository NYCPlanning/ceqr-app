import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import { action, set } from '@ember/object';

import ENV from 'labs-ceqr/config/environment';

export default class AuthRequestPasswordResetForm extends Component {
  tagName = '';
  @service router;
  @service flashMessages;

  @action
  requestResetPassword(email) {
    fetch(`${ENV.host}/auth/v1/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .catch((err) => set(this, 'error', { message: err }))
      .then(() => {
        this.flashMessages.add({
          message:
            'Password reset email sent. It may take 1 or 2 mintues to arrive.',
          type: 'success',
          sticky: true,
        });

        this.router.transitionTo('login');
      });
  }
}
