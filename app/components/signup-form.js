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

  onWhitelist(email) {
    const domain_whitelist = [
      'planning.nyc.gov',
      'omb.nyc.gov',
      'nypl.org',
      'queenslibrary.org',
      'brooklynpubliclibrary.org',
      'nycsca.org',
      'schools.nyc.gov',
      'nypd.org',
      'fdny.nyc.gov',
      'acs.nyc.gov',
      'dhs.nyc.gov',
      'hra.nyc.gov',
      'aging.nyc.gov',
      'culture.nyc.gov',
      'sbs.nyc.gov',
      'edc.nyc',
      'nycedc.com',
      'hpd.nyc.gov',
      'dob.nyc.gov',
      'health.nyc.gov',
      'nychhc.org',
      'dep.nyc.gov',
      'dsny.nyc.gov',
      'dot.nyc.gov',
      'parks.nyc.gov',
      'dcas.nyc.gov',
      'nycha.nyc.gov',
      'nyct.com',
      'cityhall.nyc.gov',
      'ddc.nyc.gov',
      'sustainability.nyc.gov',
      // Testing address
      'pichot.us'
    ];
  
    return domain_whitelist.some((domain) => {
      const emailSplit = email.split('@');
      return emailSplit[emailSplit.length - 1].toLowerCase() === domain;
    });
  },
  
  actions: {
    createUser: function(user) {      
      fetch(`${window.EmberENV.apiURL}/auth/v1/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).then((res) => {
        if (res.status !== 201) {
          this.set('error', { message: "The account could not be created"})
        } else if (!this.onWhitelist(user.email)) {
          this.get('router').transitionTo('signup.in-review')
        } else {
          this.get('router').transitionTo('signup.email')
        }        
      }).catch((err) =>
        this.set('error', { message: err })
      )
    }
  }
});
