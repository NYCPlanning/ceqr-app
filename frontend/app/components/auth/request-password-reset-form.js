import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

import ENV from 'labs-ceqr/config/environment';

export default Component.extend({
  router: service(),
  flashMessages: service(),

  actions: {
    requestResetPassword: function(email) {
      fetch(`${ENV.host}/auth/v1/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch((err) =>
        this.set('error', { message: err })
      ).then(() => {
        this.flashMessages.add({
          message: 'Password reset email sent. It may take 1 or 2 mintues to arrive.',
          type: 'success',
          sticky: true,
        })

        this.router.transitionTo('login')
      })
    }
  }
});
