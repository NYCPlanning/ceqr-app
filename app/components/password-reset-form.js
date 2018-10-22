import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import $ from 'jquery';

export default Component.extend({
  router: service(),
  
  didInsertElement() {    
    $('.ui.form').form({
      fields: {
        password: ['minLength[6]', 'empty'],
      }
    });
  },

  actions: {
    resetPassword: function(password) {
      fetch(`${window.EmberENV.apiURL}/auth/v1/password-reset/${this.id}?authorization=${this.code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      }).then((res) => {
        if (res.status === 200) {
          this.flashMessages.add({
            message: 'Password reset successfully.',
            type: 'success',
            sticky: true,
          })
          this.router.transitionTo('login')
        } else if (res.status === 400) {
          res.json().then(({ message }) =>
            this.set('error', { message })
          )
        }
      })
    }
  }
});
