import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { registerEventHandler } from '../../../helpers/mapbox/mapbox-stub-helpers';

const DEFAULT_MAPBOX_GL_INSTANCE = {
  addSource: () => {},
  addLayer: () => {},
  removeLayer: () => {},
  removeSource: () => {},
  getStyle: () => ({}),
  queryRenderedFeatures: () => [],
  on: () => {},
  off: () => {},
};

module('Integration | Component | mapbox/feature-filterer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.events = {};
    this.layers = [];
    this.hoveredFeature = null;
    this.filters = {};
    this.map = {
      ...DEFAULT_MAPBOX_GL_INSTANCE,
      addLayer: ({ id }) => {
        this.layers.push(id);
      },
      queryRenderedFeatures: () => [{
        type: 'Feature',
        properties: {
          geoid: 'test',
        },
      }],
      setFilter: (layerId, filter) => {
        this.filters[layerId] = filter;
      },
      // On render, component templates like `current-map-position.js`
      // will associate action handlers to fired mouse events and
      // mantain a list of these associations.
      // We simulate this association list locally (with the `events` object)
      // so that we can make ad hoc calls to action handlers. See comment below.
      on: (event, action) => {
        registerEventHandler(this.events, event, action);
      },
    };
  });

  test('it sets a map filter constructed from featureIds', async function(assert) {
    this.idList = ['1', '12', '123'];

    await render(hbs`
      {{mapbox/feature-filterer
        map=(hash instance=this.map)
        layerId='test'
        filterById='id'
        featureIds=this.idList
      }}
    `);

    assert.deepEqual(this.filters.test, ['in', 'id', '1', '12', '123']);
  });
});
