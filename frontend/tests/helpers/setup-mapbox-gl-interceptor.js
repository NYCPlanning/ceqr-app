import geojsonvt from 'geojson-vt';
import vtpbf from 'vt-pbf';

class MockTileServer {
  currentTile = null;

  /**
   * Creates source layers.
   * @param { sourceLayerId: {geojson dummy} }  sourceLayerDummies  The source layer dummies
   */
  createSourceLayers(sourceLayerDummies) {
    // convert geojsons to tiles
    Object.keys(sourceLayerDummies).forEach(sourceLayerId => {
      const geojson = sourceLayerDummies[sourceLayerId];

      // build an initial index of tiles
      const tileIndex = geojsonvt(geojson);
      sourceLayerDummies[sourceLayerId] = tileIndex.getTile(7, 37, 48); // todo: make dynamic
    });

    // convert tiles to protobufs
    const pbf = vtpbf.fromGeojsonVt(sourceLayerDummies, { version: 2 });

    // create blob:urls
    const blob = new Blob([pbf.buffer], { type: 'binary/octet-stream' });

    this.currentTile = URL.createObjectURL(blob);
  }
}

export function setupMapboxGlInterceptor(hooks) {
  const RealWorker = window.Worker;

  hooks.beforeEach(function() {
    this.tileServer = new MockTileServer();
    const hookCtx = this;

    window.Worker = class FakeWorker {
      constructor(path) {
        this.realWorker = new RealWorker(path);
      }

      postMessage(message, ...args) {
        if (message.type === 'loadTile') {
          if (message.data.request && hookCtx.tileServer.currentTile) {
            message.data.request.url = hookCtx.tileServer.currentTile;
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
