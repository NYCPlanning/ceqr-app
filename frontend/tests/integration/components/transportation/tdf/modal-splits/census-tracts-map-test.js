import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupMapboxGlInterceptor } from 'labs-ceqr/tests/helpers/setup-mapbox-gl-interceptor';

module('Integration | Component | transportation/tdf/modal-splits/census-tracts-map', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupMapboxGlInterceptor(hooks);

  test('it renders', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('project');
    this.server.create('transportation-analysis');

    this.project = await store.findRecord('project', 1);
    this.analysis = await store.findRecord('transportation-analysis', 1);

    await render(hbs`
      <Transportation::Tdf::ModalSplits::CensusTractsMap
        @analysis={{this.analysis}}
        @project={{this.project}}
      />
    `);

    assert.ok(this.element);
  });

  test('user can see the BBL', async function(assert) {
    const store = this.owner.lookup('service:store');

    this.server.create('project', {
      bblsGeojson: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: { name: 'bbl-1' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-73.95944768975842, 40.80929214876363],
              [-73.96112392735277, 40.80699583564126],
              [-73.9635969491312, 40.808032096187006],
              [-73.96192107071839, 40.81033240266901],
              [-73.95944768975842, 40.80929214876363],
            ],
          },
        }],
      },
    });
    this.server.create('transportation-analysis');

    this.project = await store.findRecord('project', 1);
    this.analysis = await store.findRecord('transportation-analysis', 1);

    await render(hbs`
      <Transportation::Tdf::ModalSplits::CensusTractsMap
        @analysis={{this.analysis}}
        @project={{this.project}}
      />
    `);

    await waitFor('.mapboxgl-accessibility-marker', {
      timeout: 5000,
    });

    assert.ok(this.element.querySelector('[title="bbl-1"]'));
  });

  // TODO: async isseus with the map loading... 
  // need to register when map has rendered.
  // This is failing when running the whole suite...
  // FLAKEY
  test('user can click the census tract', async function(assert) {
    assert.expect(1);

    const store = this.owner.lookup('service:store');

    this.server.create('project');
    this.server.create('transportation-analysis');

    this.project = await store.findRecord('project', 1);
    this.analysis = await store.findRecord('transportation-analysis', 1);
    this.addCensusTract = function() {
      assert.ok(true, 'did click');
    }
    this.tileServer.createSourceLayers({
      tracts: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature', properties: { geoid: 1, name: 'census-tract-1', },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-180, -90],[180, -90],[180, 90],[-180, 90],[-180, -90]]],
            },
          },
        ],
      }
    });

    await render(hbs`
      <Transportation::Tdf::ModalSplits::CensusTractsMap
        @analysis={{this.analysis}}
        @project={{this.project}}
        @addCensusTract={{action this.addCensusTract}}
      />
    `);

    await click('.mapboxgl-canvas');
  });
});
