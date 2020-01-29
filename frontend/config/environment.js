
module.exports = function(environment) {
  const ENV = {
    host: getHost(environment),
    'mapbox-gl': {
      accessToken: 'pk.eyJ1IjoicGljaG90IiwiYSI6ImNqbWIzYzFyeTVrbHAzcW9nbmRmeXNmbHcifQ.VEiOF5YV_9kxwXekZ3fWLA',
      map: {
        style: 'mapbox://styles/mapbox/light-v9',
      },
    },
    carto: {
      username: 'planninglabs',
      domain: 'planninglabs.carto.com',
    },
    'ember-simple-auth-token': {
      serverTokenEndpoint: `${getHost(environment)}/auth/v1/login`,
      refreshAccessTokens: false,
      tokenExpireName: 'exp',
      tokenExpirationInvalidateSession: true,
    },
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-84250233-14',
          // Use `analytics_debug.js` in development
          // debug: environment === 'development',
          // Use verbose tracing of GA events
          // trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development',
          // Specify Google Analytics plugins
          // require: ['ecommerce']
        },
      },
    ],
    fontawesome: {
      icons: {
        'free-solid-svg-icons': [
          'equals',
        ],
      },
    },
    SENTRY_DSN: process.env.SENTRY_DSN,
    newRelic: {
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    },

    modulePrefix: 'labs-ceqr',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    ENV['ember-simple-auth-token'].tokenExpirationInvalidateSession = false;
    ENV['ember-cli-mirage'] = {
      enabled: !process.env.DISABLE_MIRAGE,
    };
    ENV.shouldThrowOnError = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV['ember-simple-auth-token'].tokenExpirationInvalidateSession = false;
  }

  if (environment === 'review') {
    ENV.newRelic.applicationId = process.env.NEW_RELIC_STAGING_APP_ID;
  }

  if (environment === 'staging') {
    ENV.newRelic.applicationId = process.env.NEW_RELIC_STAGING_APP_ID;
  }

  if (environment === 'production') {
    ENV.newRelic.applicationId = process.env.NEW_RELIC_PRODUCTION_APP_ID;
  }

  return ENV;
};

function getHost(environment) {
  if (process.env.HOST) {
    return process.env.HOST;
  }

  if (environment === 'staging') {
    return 'https://staging.api.ceqr.app';
  }

  if (environment === 'production') {
    return 'https://api.ceqr.app';
  }

  if (environment === 'review') {
    return process.env.HOST_PR_REVIEW;
  }

  return '';
}
