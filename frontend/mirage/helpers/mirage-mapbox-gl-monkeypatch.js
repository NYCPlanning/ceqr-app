import geojsonvt from 'geojson-vt';
import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import vtpbf from 'vt-pbf';
import { CollisionBoxArray } from 'mapbox-gl/src/data/array_types';
import FeatureIndex from 'mapbox-gl/src/data/feature_index';
import { serialize, deserialize } from 'mapbox-gl/src/util/web_worker_transfer';
import { OverscaledTileID } from 'mapbox-gl/src/source/tile_id';

// build an initial index of tiles
const tileIndex = geojsonvt({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        landuse: '0102391203912',
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -75.41015624999999,
              38.8225909761771
            ],
            [
              -71.43310546875,
              38.8225909761771
            ],
            [
              -71.43310546875,
              41.178653972331674
            ],
            [
              -75.41015624999999,
              41.178653972331674
            ],
            [
              -75.41015624999999,
              38.8225909761771
            ]
          ]
        ]
      }
    }
  ]
});

// request a particular tile
const dummyTiles = tileIndex.getTile(7, 37, 48);

// see https://github.com/mapbox/mapbox-gl-js/blob/d9e9ffe39a823b2f4a790b805b4fd2859c363cc4/test/unit/source/tile.test.js#L294-L301
function createVectorData(options) {
  const collisionBoxArray = new CollisionBoxArray();

  return {
    collisionBoxArray: collisionBoxArray,
    featureIndex: new FeatureIndex(new OverscaledTileID(1, 0, 1, 1, 1)),
    buckets: [],
    ...options,
  };
}

export default () => {
  const RealWorker = window.Worker;

  window.Worker = class FakeWorker {
    constructor(path) {
      try {
        this.realWorker = new RealWorker(path);
      } catch (e) {
        console.log(e);
      }
    }

    postMessage(message, ...args) {
      try {
        this.realWorker.postMessage(message, ...args);
      } catch (e) {
        console.log(e);
      }
    }

    addEventListener(event, callback, opt) {
      const curryCallback = function(event) {
        if (event.data.data) {
          const {
            rawTileData,
            featureIndex,
            buckets,
          } = createVectorData({
            rawTileData: vtpbf.fromGeojsonVt({ pluto: dummyTiles })
          });

          event.data.data.rawTileData = rawTileData;
          // event.data.data.featureIndex = featureIndex;
          // event.data.data.buckets = buckets;
        }

        return callback(event);
      };

      try {
        this.realWorker.addEventListener(event, curryCallback, opt);
      } catch (e) {
        console.log(e);
      }
    }

    removeEventListener(...args) {
      try {
        this.realWorker.removeEventListener(...args);
      } catch (e) {
        console.log(e);
      }
    }

    terminate(...args) {
      try {
        this.realWorker.terminate(...args);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
