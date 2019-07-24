import DS from 'ember-data';
import TokenAuthorizerMixin from 'ember-simple-auth-token/mixins/token-authorizer';

import ENV from 'labs-ceqr/config/environment';

export default DS.JSONAPIAdapter.extend(TokenAuthorizerMixin, {
  host: ENV.host,
  namespace: 'api/v1',
});
