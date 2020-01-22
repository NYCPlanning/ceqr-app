import Component from '@ember/component';
import { action } from '@ember/object';
import { buildWaiter } from 'ember-test-waiters';

const mapWaiter = buildWaiter('map-waiter');

export default class MapboxBasicMapComponent extends Component {
  mapLoaded = () => {};

  didInsertElement() {
    this.token = mapWaiter.beginAsync();
  }

  _onMapDataLoad = (event) => {
    mapWaiter.endAsync(this.token);

    event.target.off(this._onMapDataLoad);
  }

  @action
  _mapLoaded(map) {
    map.once('idle', this._onMapDataLoad);

    this.mapLoaded(map);
  }
}
