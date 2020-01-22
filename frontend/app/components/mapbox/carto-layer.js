import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { buildWaiter } from 'ember-test-waiters';

/**
 *
 * Layer configuration container object, used largely by parent.
 * Intended to make API consumer front clearer. See carto-layers
 * component for actual rendering code
 *
 */
export default class MapboxMapboxAnonymousMapLayerComponent extends Component {
  init(...args) {
    super.init(...args);

    this.registerWithParent(this);

    this.waiter = buildWaiter('layer-waiter');
  }

  /**
   * map with an instance of the map: {map: instance}
   */
  map = {};

  didInsertElement() {
    this.token = this.waiter.beginAsync();

    this.map.instance.on('render', this._layerHasLoaded);
  }

  _layerHasLoaded = (event) => {
    // check if the layer is available in the map
    if (event.target.getLayer(this.elementId)) {
      // remove the listener
      try { this.waiter.endAsync(this.token); } catch (e) {}

      // remove the event
      event.target.off(this._layerHasLoaded);
    }
  }

  willDestroyElement() {
    this.unregisterWithParent(this);
  }

  /**
   *
   * Public component parameters
   *
   */

  // action handler passed from parent will replace this
  // public
  registerWithParent = () => {};

  // action handler passed from parent will replace this
  // public
  unregisterWithParent = () => {};

  // public
  layer = {};

  tiles = [];

  layerId = guidFor(this);

  @computed('layer')
  get mapboxLayerOptions() {
    return {
      id: this.elementId,
      source: this._parentElementId,
      ...(this.tiles.length ? { 'source-layer': this.layerId } : {}),
      ...this.layer,
    };
  }

  // private
  // used to identify the parent source
  _parentElementId = '';
}
