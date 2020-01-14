import Component from '@ember/component';
import fetch from 'fetch';
import { action, computed } from '@ember/object';

export const CARTO_USERNAME = 'planninglabs';
export const CARTO_MAPS_ENDPOINT = `https://${CARTO_USERNAME}.carto.com/api/v1/map`;

/**
 *
 * MapboxCartoLayersComponent renders vector tile layers via e-mapbox-gl.
 * It provides a contextual component necessary for setting up layers:
 *
 * ```
 * {{#mapbox/carto-vector-source map=map as |carto-layer|}}
 *   {{carto-layer
 *     sql='select * from geodata'
 *     layer=(hash fill-color='blue')
 *   }}
 * {{/mapbox/carto-vector-source}}
 * ```
 *
 * Currently this can't handle subsequent invocations of carto-layers because
 * of a limitation with the ember-mapbox-gl bindings lib and there isn't an
 * API for it. See https://github.com/mapbox/mapbox-gl-js/pull/8048.
 */
export default class MapboxCartoLayersComponent extends Component {
  // ember hook, triggered on render. used here to trigger template URL handshake.
  didInsertElement() {
    this.fetchTemplate();
  }

  // public
  // required
  // e-mapbox-gl map object
  map = null;

  // public
  // options used for the mapbox-gl source definition
  options = {};

  // private
  _registeredLayers = [];

  // resolved tilejson url templates from carto
  _tiles = [];

  // sets up source according mapbox-gl source specification
  @computed('_tiles')
  get mapboxSourceOptions() {
    return {
      type: 'vector',
      tiles: this._tiles,
      ...this.options,
    };
  }

  // options object used for Carto Maps API.
  // creates an entry in the layers property for
  // each child layer component that depends on child layers ids
  @computed('_registeredLayers')
  get cartoAnonMapOptions() {
    return {
      version: '1.3.1',
      layers: [
        ...this._registeredLayers.map((layer) => ({
          type: 'mapnik',
          // layer-source id
          id: layer.layerId,
          options: {
            sql: layer.sql,
          },
        })),
      ],
    };
  }

  // local callback function used to update layers
  @action
  handleUpdatedLayersRegistry(registeredLayers) {
    this.set('_registeredLayers', registeredLayers);
  }

  // fetches a valid tilejson template from carto and sets it
  async fetchTemplate() {
    // if there are no registered layers, skip
    if (!this._registeredLayers.length) return;

    const tiles = await requestTileJSON(this.cartoAnonMapOptions);

    this.set('_tiles', tiles);
  }
}

async function requestTileJSON(cartoMapOptions) {
  const result = await fetch(CARTO_MAPS_ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartoMapOptions),
  });

  const json = await result.json();
  const { metadata: { tilejson: { vector: { tiles } } } } = json;

  return tiles;
}
