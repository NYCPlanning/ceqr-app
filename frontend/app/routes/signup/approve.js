import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import fetch from 'fetch';

import ENV from 'labs-ceqr/config/environment';

export default class SignupApproveRoute extends Route {
  async model({ token }) {    
    const response = await fetch(`${ENV.host}/auth/v1/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch((err) =>
      this.set('error', { message: err })
    );

    const body = await response.json();

    return RSVP.hash({ 
      status: response.status,
      body
     });
  }
}
