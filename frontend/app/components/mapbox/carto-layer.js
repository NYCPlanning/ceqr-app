import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { guidFor } from '@ember/object/internals';

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

  // public
  @computed
  get layerId() {
    return guidFor(this);
  }

  @computed('layer')
  get mapboxLayerOptions() {
    return  {
      id: this.elementId,
      source: this._parentElementId,
      'source-layer': this.layerId,
      ...this.layer,
    };
  }

  // private
  // used to identify the parent source
  _parentElementId = '';
}
