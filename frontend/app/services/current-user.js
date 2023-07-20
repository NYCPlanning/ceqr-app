import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';

export default class CurrentUserService extends Service {
  @service session;
  @service store;

  load() {
    const userId = this.session?.data?.authenticated?.tokenData?.user_id;

    if (!isEmpty(userId)) {
      return this.store.findRecord('user', userId).then((user) => {
        set(this, 'user', user);
      });
    }
    return RSVP.resolve();
  }
}
