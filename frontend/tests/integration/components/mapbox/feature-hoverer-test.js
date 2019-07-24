import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { registerEventHandler, simulateEvent }  from '../../../helpers/mapbox/mapbox-stub-helpers';

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

module('Integration | Component | mapbox/feature-hoverer', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {

    this.expectedQueriedFeature = {
      type: 'Feature',
      properties: {
        geoid: 'test',
      },
    }

    this.events = {};
    this.map = {
      ...DEFAULT_MAPBOX_GL_INSTANCE,
      queryRenderedFeatures: () => {
        return [this.expectedQueriedFeature]
      },
      on: (event, action) => {
        registerEventHandler(this.events, event, action);
      }
    };
  });

  test('it returns hovered features via onFeatures handler', async function(assert) {

    this.hoveredFeature = null;
    this.setHoveredFeature = (features) => {
      this.hoveredFeature = features;
    }

    await render(hbs`
      {{mapbox/feature-hoverer
        map=(hash instance=this.map)
        layerId='test'
        onFeatures=this.setHoveredFeature
      }}
    `);

    simulateEvent(this.events, 'mousemove', { point: { x: 0, y: 0 }});
    assert.equal(JSON.stringify(this.hoveredFeature), JSON.stringify([this.expectedQueriedFeature]));

  })
});
