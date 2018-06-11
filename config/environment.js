'use strict';

module.exports = function(environment) {
  let ENV = {
    'mapbox-gl': {
      accessToken: 'pk.eyJ1IjoiY2FwaXRhbHBsYW5uaW5nbnljIiwiYSI6ImNqODUwYmxyYzBnY3AycW9hOXA5NDE2eDQifQ.HYuWjTiwSoTu-QLWo0D76w'
    },
    firebase: {
      apiKey: 'AIzaSyAfWajzce_AdQKIsjWMfWgbx5ZKGKEVMtk',
      authDomain: 'ceqr-schools-analysis.firebaseapp.com',
      databaseURL: 'https://ceqr-schools-analysis.firebaseio.com',
      storageBucket: 'ceqr-schools-analysis.appspot.com',
    },
    torii: {
      sessionServiceName: 'session'
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
  }

  return ENV;
};
