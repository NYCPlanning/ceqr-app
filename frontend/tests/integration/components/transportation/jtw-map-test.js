import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Component from '@ember/component';
import { registerEventHandler}  from '../../../helpers/mapbox/mapbox-stub-helpers';


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


module('Integration | Component | transportation/jtw-map', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.events = {};
    this.layers = [];
    this.filters = {}
    this.map = {
      ...DEFAULT_MAPBOX_GL_INSTANCE,
      addLayer: ({ id }) => {
        this.layers.push(id);
      },
      queryRenderedFeatures: () => {
        return [{
          type: 'Feature',
          properties: {
            geoid: 'test',
          },
        }]
      },
      setFilter: (layerId, filter) => {
        this.filters[layerId] = filter;
      },
      // On render, component templates like `current-map-position.js`
      // will associate action handlers to fired mouse events and 
      // mantain a list of these associations. 
      // We simulate this association list locally (with the `events` object)
      // so that we can make ad hoc calls to action handlers. See comment below
      // in `it hovers, displays information`.
      on: (event, action) => {
        registerEventHandler(this.events, event, action);
      }
    };

    const that = this;
    class BasicMapStub extends Component {
      map = that.map;
    }

    this.owner.register('component:mapbox/basic-map', BasicMapStub);
    this.owner.register('template:components/mapbox/basic-map', hbs`
      {{yield (hash instance=this.map)}}
    `);
  });

  test('it has highlighted tracts, buses, and subways in map', async function(assert) {

    await render(hbs`{{transportation/jtw-map}}`);

    assert.ok(this.layers.includes('tracts-highlight'));
    assert.ok(this.layers.includes('subway'));
    assert.ok(this.layers.includes('bus'));
  });

});
