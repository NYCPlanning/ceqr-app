import Component from '@ember/component';
import deepmerge from 'deepmerge';
import { helper } from '@ember/component/helper';
import { assign } from '@ember/polyfills';
import { defaultMapboxEventStub } from './mapbox-gl-stub/default-mapbox-api-surface';
import MapboxGl from './mapbox-gl-stub/mapbox-gl';
import MapboxGlSource from './mapbox-gl-stub/mapbox-gl-source';
import MapboxOn from './mapbox-gl-stub/mapbox-gl-on';

// main export used in qunit tests to pull in the mapbox-gl stub
// `setupMapboxStubs(hooks);`
// This also defines an extension of the mapbox-gl stub so that the
// test context can be pulled in.
// When this is used, each test will have access to a stub property
// called `mapboxEventStub`, allowing insertion of mock methods/properties
// or references for intercepting events:
//
// Mock response for an internal mapbox-gl method:
// this.mapboxEventStub = {
//   mapInstance: {
//     querySourceFeatures() {
//       return [mockFeature];
//     },
//   },
// };

// Intercept mapbox-gl events and trigger artificially:
// const artificialEvents = {};
// this.mapboxEventStub = {
//   mapInstance: {
//     on: (event, func) => {
//       artificialEvents[event] = func;
//     },
//   },
// };
//
// artificialEvents.click(triangleFC);
//
// In the example above, artificialEvents.click() directly calls the event callback
// for the mapbox-gl `click` event. The argument is whatever that callback is provided
// as an argument.
export default function(hooks) {
  hooks.beforeEach(function() {
    let _mapboxEventStub = defaultMapboxEventStub;
    Object.defineProperty(this, 'mapboxEventStub', {
      get() {
        return _mapboxEventStub;
      },
      set(val) {
        console.log(val, defaultMapboxEventStub);
        _mapboxEventStub = deepmerge(defaultMapboxEventStub, val);
      },
    });

    const that = this;
    // extend stub and bind in the current test context so it can be
    // dynamically referenced
    class MapboxGlStub extends MapboxGl {
      init(...args) {
        this.mapboxEventStub = that.mapboxEventStub;
        super.init(...args);
      }
    }

    // template helper used in the template for the mocks above. this helper
    // simple merges multiple objects into one. it's helpful for extending objects
    // that're usually yielded out from a component.
    this.owner.register('helper:assign', helper(function(hashes, hash) {
      return assign({}, ...hashes, hash);
    }));

    // ember/qunit interface for stubbing in the above classes, replacing
    // the mapbox-gl dependencies in test mode
    this.owner.register('component:mapbox-gl-on', MapboxOn);
    this.owner.register('component:mapbox-gl-layer', Component);
    this.owner.register('component:mapbox-gl-source', MapboxGlSource);

    // main, wrapping mapbox-gl component
    this.owner.register('component:mapbox-gl', MapboxGlStub);
  });
}
