import { inject as service } from Service from '@ember/service';


import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

export default Service.extend({
  session: service(),
  store: service(),

  load() {  
    let userId = this.get('session.data.authenticated.tokenData.user_id');

    if (!isEmpty(userId)) {
      return this.get('store').findRecord('user', userId).then((user) => {
        this.set('user', user);
      });
    } 
      return RSVP.resolve();
    
  }
});
