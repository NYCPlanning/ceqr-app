'use strict';

module.exports = function(environment) {
  let ENV = {
    'mapbox-gl': {
      accessToken: 'pk.eyJ1IjoicGljaG90IiwiYSI6ImNqbWIzYzFyeTVrbHAzcW9nbmRmeXNmbHcifQ.VEiOF5YV_9kxwXekZ3fWLA'
    },
    'ember-simple-auth-token': {
      serverTokenEndpoint: '/api/token-auth/', // actually set in environment
      refreshAccessTokens: false,
    },

    modulePrefix: 'cp-ceqr-schools',
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
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.EmberENV.apiURL = 'http://localhost:1337'
    ENV['ember-simple-auth-token'].serverTokenEndpoint = 'http://localhost:1337/auth/v1/login'
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.EmberENV.apiURL = 'https://api.ceqr.app'
    ENV['ember-simple-auth-token'].serverTokenEndpoint = 'https://api.ceqr.app/auth/v1/login'
  }

  return ENV;
};
