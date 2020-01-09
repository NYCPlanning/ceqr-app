import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from "ember-cli-mirage/test-support";
import { CARTO_MAPS_ENDPOINT } from 'labs-ceqr/components/mapbox/carto-vector-source';

const DEFAULT_CARTO_RESPONSE = {
  metadata: {
    tilejson: {
      vector: {
        tiles: ['https://cooltiles.com/{z}/{x}/{y}.mvt'], 
      },
    },
  },
};

const DEFAULT_MAPBOX_GL_INSTANCE = {
  addSource: () => {},
  addLayer: () => {},
  removeLayer: () => {},
  removeSource: () => {},
  getStyle: () => ({}),
};

module('Integration | Component | mapbox/carto-vector-source', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders without layers', async function(assert) {
    this.map = {
      instance: { ...DEFAULT_MAPBOX_GL_INSTANCE },
    };

    // Template block usage:
    await render(hbs`
      {{mapbox/carto-vector-source map=map}}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it requests url templates in correct format', async function(assert) {
    assert.expect(2);

    this.map = {
      instance: { ...DEFAULT_MAPBOX_GL_INSTANCE },
    };

    this.server.post(CARTO_MAPS_ENDPOINT, function(schema, request) {
      const { layers } = JSON.parse(request.requestBody);

      assert.deepEqual(layers, [{
        type: 'mapnik',
        id: layers[0].id, // this is a randomized guid
        options: {
          sql: 'select * from table',
        }
      }]);

      return { ...DEFAULT_CARTO_RESPONSE };
    });

    await render(hbs`
      {{#mapbox/carto-vector-source map=map as |carto-source|}}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='red')
          )
        }}
      {{/mapbox/carto-vector-source}}
    `);

    assert.ok(true);
  });

  test('it requests multiple in one request', async function(assert) {
    assert.expect(5);

    this.map = {
      instance: { ...DEFAULT_MAPBOX_GL_INSTANCE },
    };

    this.map.instance.addLayer = () => {
      assert.ok(true);
    }

    this.map.instance.addSource = () => {
      assert.ok(true);
    }

    this.server.post(CARTO_MAPS_ENDPOINT, function(schema, request) {
      const { layers } = JSON.parse(request.requestBody);

      assert.deepEqual(layers.length, 3);

      return { ...DEFAULT_CARTO_RESPONSE };
    });

    // Template block usage:
    await render(hbs`
      {{#mapbox/carto-vector-source map=map as |carto-source|}}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='red')
          )
        }}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='green')
          )
        }}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='refactor')
          )
        }}
      {{/mapbox/carto-vector-source}}
    `);
  });

  // TODO: this is a bug - conditionally invoking a layer in carto-vector-source
  // does not get added.
  // this is also a limitation of ember-mapbox-gl, which does not have a way
  // of updating sources when tiles are changed.
  // See this for a valid path for update: https://github.com/mapbox/mapbox-gl-js/pull/8048
  skip('it honors re-renders, conditional invocations', async function(assert) {
    assert.expect(2);

    this.map = {
      instance: { ...DEFAULT_MAPBOX_GL_INSTANCE },
    };

    // mock the server
    this.server.post(CARTO_MAPS_ENDPOINT, function() { 
      return { ...DEFAULT_CARTO_RESPONSE };
    });

    // setup test context
    this.shouldShowLayer = false;

    // Template block usage:
    await render(hbs`
      {{#mapbox/carto-vector-source map=map as |carto-source|}}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='red')
          )
        }}

        {{#if this.shouldShowLayer}}
          {{carto-source.layer
            sql='select * from table2'
            layer=(hash
              type='line'
              paint=(hash line-color='green')
            )
          }}
        {{/if}}
      {{/mapbox/carto-vector-source}}
    `);

    this.set('shouldShowLayer', true);
  });

  test('adds layers after sources', async function(assert) {
    assert.expect(3);

    this.map = {
      instance: { ...DEFAULT_MAPBOX_GL_INSTANCE },
    };

    let addedSource = '';
    this.map.instance.addSource = (source) => {
      addedSource = source;
    }

    this.map.instance.addLayer = (layer) => {
      assert.equal(layer.source, addedSource);
    }

    this.server.post(CARTO_MAPS_ENDPOINT, function() {
      return { ...DEFAULT_CARTO_RESPONSE };
    });

    // Template block usage:
    await render(hbs`
      {{#mapbox/carto-vector-source map=map as |carto-source|}}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='red')
          )
        }}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='green')
          )
        }}
        {{carto-source.layer
          sql='select * from table'
          layer=(hash
            type='line'
            paint=(hash line-color='refactor')
          )
        }}
      {{/mapbox/carto-vector-source}}
    `);
  })
});
