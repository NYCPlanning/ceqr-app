import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import ENV from 'labs-ceqr/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service() session;
  host = ENV.host;
  namespace = 'api/v1';

  @computed('session.{isAuthenticated,data.authenticated.token}', function () {
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      };
    }
    return {};
  })
  headers;

  handleResponse(status) {
    if (status === 401 && this.session.isAuthenticated) {
      this.session.invalidate();
    }
    return super.handleResponse(...arguments);
  }
}
