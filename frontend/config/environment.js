'use strict';

module.exports = function(environment) {

  const BUILD_CONTEXT = process.env.BUILD_CONTEXT || 'localdev';
  let host;
  if (BUILD_CONTEXT === 'test' || BUILD_CONTEXT === 'localdev') {
   // Mirage data requires host to be set ('undefined' causes problems) so set host to empty string
    host = ''
  } else {
   // All other contexts (production, staging, branch_deploy, docker) expect HOST to be set by an environment variable HOST
   host = process.env.HOST;
  }

  let ENV = {
    host,
    'mapbox-gl': {
      accessToken: 'pk.eyJ1IjoicGljaG90IiwiYSI6ImNqbWIzYzFyeTVrbHAzcW9nbmRmeXNmbHcifQ.VEiOF5YV_9kxwXekZ3fWLA'
    },
    carto: {
      username: 'planninglabs',
      domain: 'planninglabs.carto.com',
    },
    'ember-simple-auth-token': {
      serverTokenEndpoint: `${host}/auth/v1/login`,
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
        }
      }
    ],
    fontawesome: {
      icons: {
        'free-solid-svg-icons': [
          'equals'
         ]
      }
    },
    SENTRY_DSN: process.env.SENTRY_DSN,

    modulePrefix: 'labs-ceqr',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    ENV['ember-simple-auth-token'].tokenExpirationInvalidateSession = false;
    // only use mirage data when running the frontend as 'development' NOT in docker
    ENV['ember-cli-mirage'] = {
      enabled: process.env.BUILD_CONTEXT === 'docker' ? false : typeof process.env.RAILS_ENV === 'undefined',
    }
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
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

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
