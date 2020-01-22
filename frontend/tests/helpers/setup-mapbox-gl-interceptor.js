import geojsonvt from 'geojson-vt';
import vtpbf from 'vt-pbf';

export function generateTileArtifactAndUrl() {
  // build an initial index of tiles
  const tileIndex = geojsonvt({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          geoid: 1,
          name: 'census-tract-1',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [
                -180,
                -90
              ],
              [
                180,
                -90
              ],
              [
                180,
                90
              ],
              [
                -180,
                90
              ],
              [
                -180,
                -90
              ]
            ]
          ],
        },
      },
    ],
  });

  const dummyTiles = tileIndex.getTile(7, 37, 48);
  const pbf = vtpbf.fromGeojsonVt({
    tracts: dummyTiles,
    'tracts-line': dummyTiles,
  });
  const blob = new Blob([pbf.buffer], { type: 'binary/octet-stream' });

  return URL.createObjectURL(blob);
}

export function setupMapboxGlInterceptor(hooks) {
  const RealWorker = window.Worker;

  hooks.beforeEach(function() {
    window.Worker = class FakeWorker {
      constructor(path) {
        this.realWorker = new RealWorker(path);
      }

      postMessage(message, ...args) {
        if (message.type === 'loadTile') {
          if (message.data.request) {
            message.data.request.url = generateTileArtifactAndUrl();
          }
        }

        try {
          this.realWorker.postMessage(message, ...args);
        } catch (e) {
          console.log(e);
        }
      }

      addEventListener(event, callback, opt) {
        this.realWorker.addEventListener(event, callback, opt);
      }

      removeEventListener(...args) {
        this.realWorker.removeEventListener(...args);
      }

      terminate(...args) {
        this.realWorker.terminate(...args);
      }
    };
  });

  hooks.afterEach(function() {
    window.Worker = RealWorker;
  })
};
