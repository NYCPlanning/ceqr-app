import DS from 'ember-data';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import ENV from 'labs-ceqr/config/environment';

export default DS.JSONAPIAdapter.extend({
  session: service(),
  host: ENV.host,
  namespace: 'api/v1',

  headers: computed(
    'session.isAuthenticated',
    'session.data.authenticated.token',
    function () {
      if (this.session.isAuthenticated) {
        return {
          Authorization: `Bearer ${this.session.data.authenticated.token}`,
        };
      }
      return {};
    }
  ),

  handleResponse(status) {
    if (status === 401 && this.session.isAuthenticated) {
      this.session.invalidate();
    }
    return this._super(...arguments);
  },
});
