import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import Component from '@ember/component';
import { registerEventHandler, simulateEvent }  from '../../../helpers/mapbox/mapbox-stub-helpers';

const renderedGeoId = '1';
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
            geoid: renderedGeoId,
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

  test('it has tracts, buses, and subways in map', async function(assert) {

    await render(hbs`{{transportation/study-area-map}}`);

    assert.ok(this.layers.includes('tracts-line'));
    assert.ok(this.layers.includes('tracts-fill'));
    assert.ok(this.layers.includes('tracts-highlight'));
    assert.ok(this.layers.includes('subway'));
    assert.ok(this.layers.includes('bus'));
  });

  test('it hovers, displays information', async function(assert) {
    await render(hbs`{{transportation/study-area-map}}`);

    // To simulate an event, we go straight to simply calling
    // the event handler with whatever arguments (like clicked point)
    // we want. 
    simulateEvent(this.events, 'mousemove', { point: { x: 0, y: 0 }});

    await settled();

    assert.ok(find("[data-test-popup='census-tract']"));
  });

  test('it selects features on click', async function(assert) {
    // If a project exists with a transportation analysis
    const project = server.create('project');
    this.model = await this.owner.lookup('service:store')
      .findRecord('project', project.id, { include: 'transportation-analysis'});

    const geoid = renderedGeoId;

    await render(hbs`{{transportation/study-area-map analysis=model.transportationAnalysis}}`);
    simulateEvent(this.events, 'click', {point: 'point'});

    await settled();

    const updatedStudySelection = await this.get('model.transportationAnalysis.jtwStudySelection');
    assert.ok(updatedStudySelection.includes(geoid));
  });
});
