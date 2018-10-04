import Component from '@ember/component';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

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
        password: ['minLength[6]', 'empty'],
      }
    });
  },
  
  actions: {
    createUser: function(user) {
      console.log(user)
      
      fetch(`${window.EmberENV.apiURL}/auth/v1/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then(() => 
        this.get('router').transitionTo('signup.email')
      )
    }
  }
});
