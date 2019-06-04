import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Component from '@ember/component';

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

module('Integration | Component | transportation/study-area-map', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.map = DEFAULT_MAPBOX_GL_INSTANCE;

    const that = this;
    class BasicMapStub extends Component {
      map = that.map;
    }

    this.owner.register('component:mapbox/basic-map', BasicMapStub);
    this.owner.register('template:components/mapbox/basic-map', hbs`
      {{yield (hash instance=this.map)}}
    `);
  });

  test('it has tracts, buses, and subways in map', async function(assert) {
    let layers = [];
    this.map = {
      ...DEFAULT_MAPBOX_GL_INSTANCE,
      addLayer({ id }) {
        layers.push(id);
      }
    };

    await render(hbs`{{transportation/study-area-map}}`);

    assert.ok(layers.includes('tracts-line'));
    assert.ok(layers.includes('tracts-fill'));
    assert.ok(layers.includes('subway'));
    assert.ok(layers.includes('bus'));
  });

  test('it hovers, displays information', async function(assert) {
    const geoid = '1';
    this.server.create('census-tract', 2, { geoid });

    let events = {};
    this.map = {
      ...DEFAULT_MAPBOX_GL_INSTANCE,
      queryRenderedFeatures() {
        return [{
          type: 'Feature',
          properties: {
            geoid: 'test',
          },
        }]
      },
      on: (event, action) => {
        events[event] = action;
      },
    };

    await render(hbs`{{transportation/study-area-map}}`);

    events['mousemove']({
      point: { x: 0, y: 0 },
    });

    await settled();

    assert.ok(find("[data-test-popup='census-tract']"));
  });
});
