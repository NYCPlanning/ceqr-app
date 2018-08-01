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
      this.get('session').open('firebase', {
        provider: 'password',
        email: user.email,
        password: user.password
      }).catch((e) => {
        this.set('error', e);
      }).then(() => {
        this.get('router').transitionTo('user.projects');
      });
    },
  }
});
