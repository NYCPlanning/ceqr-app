import JSONAPIAdapter from '@ember-data/adapter/json-api';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

import ENV from 'labs-ceqr/config/environment';

export default JSONAPIAdapter.extend(TokenAuthorizerMixin, {
  host: ENV.host,
  namespace: 'api/v1',
});
