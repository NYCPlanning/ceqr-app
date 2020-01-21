import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | transportation/tdf/modal-splits/census-tracts-map', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

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

    await this.pauseTest();

    await waitFor('.mapboxgl-accessibility-marker', {
      timeout: 5000,
    });

    assert.ok(this.element.querySelector('[title="bbl-1"]'));
  });
});
