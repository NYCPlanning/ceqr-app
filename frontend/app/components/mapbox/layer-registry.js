import Component from '@ember/component';
import { action, computed, notifyPropertyChange } from '@ember/object';

export default class MapboxLayerRegistryComponent extends Component {
  tagName = '';
  @computed('__registeredLayers')
  get registeredLayers() {
    return Array.from(this.__registeredLayers);
  }

  // public callback function
  didUpdateLayersRegistry = () => {};

  // stores references to instances of child layers
  __registeredLayers = new Set();

  // notify layers list
  _didUpdateLayersRegistry() {
    notifyPropertyChange(this, '__registeredLayers');

    this.didUpdateLayersRegistry(this.registeredLayers);
  }

  // passed to child layers for storing their references
  @action
  _registerLayer(layer) {
    this.__registeredLayers.add(layer);

    this._didUpdateLayersRegistry();
  }

  // passed to child layers for storing their references
  @action
  _unregisterLayer(layer) {
    this.__registeredLayers.delete(layer);

    this._didUpdateLayersRegistry();
  }
}
