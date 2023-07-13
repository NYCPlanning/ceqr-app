import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import * as Sentry from '@sentry/browser';
import Resolver from 'ember-resolver';
import config from 'labs-ceqr/config/environment';

Sentry.init({
  dsn: config.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Ember()],
  environment: config.environment,
});

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
});

loadInitializers(App, config.modulePrefix);

export default App;
