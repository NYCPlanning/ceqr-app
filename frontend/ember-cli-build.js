'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      plugins: [
        "@babel/plugin-proposal-object-rest-spread"
      ]
    },

    // Disable jQuery bundled with Ember.js
    vendorFiles: { 'jquery.js': null },
    // Example to include jQuery slim instead of default build
    jquery: {
      slim: true
    },

    autoImport: {
      alias: {
        // if in development mode, use development version of mapbox-gl for easier debugging
        // mapbox-gl-dev is unminified and therefore easier to read 
        ...(process.env.EMBER_ENV === 'development' ? {'mapbox-gl': 'mapbox-gl/dist/mapbox-gl-dev'} : {})
      },
      webpack: {
        // required for the jwa (jsonwebtoken) dependency
        node: { crypto: true, stream: true, buffer: true }
      },
      // something to do with babel transpliation for mbgl. see https://github.com/mapbox/mapbox-gl-js/issues/3422
      skipBabel: [{
        package: 'mapbox-gl',
        semverRange: '*'
      }],
    },

    'ember-ast-hot-load': {
      helpers: [
        'page-title',
        'find-modal-split',
        'get-aggregate-value',
        'get-aggregate-percent',
        'get-split-value',
        'get-split-percent',
        'human-readable-census-tract',
        'map-color-for',
        'percentage',
        'school-year',
        'mode-label',
        'humanize-geoid'
      ],
      enabled: true
    }
  });

  app.import('node_modules/@sentry/browser/dist/index.js', {
    using: [
      { transformation: 'cjs', as: '@sentry/browser' }
    ]
  });

  // app.import('vendor/carto-vl/carto-vl.min.js');
  // app.import('vendor/jquery-tablesort-semantic-ui/tablesort.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
