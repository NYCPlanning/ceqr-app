import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TransportationJtwMapComponent extends Component {
  /**
   * The project model
   */
  project = {};

  /**
   * Action to pass to the MapboxGL instance created by Mapbox::Basic map in this component's template
   */
  @action
  mapLoaded(map) {
    map.on('data', this.onMapStyleLoaded);
  }

  /**
   * Helper function to ensure 'bbls' layer is the top-most layer. MapboxGL styleIsLoaded() check,
   * and 'style.load' events do not reliably indicate a fully loaded style object.
   * To display 'bbls' as the top-most layer, must move it with moveLayer()
   */
  onMapStyleLoaded(e) {
    const { target: map } = e;
    const style = map.getStyle();
    if (style.sources.bbls_geojson && style.sources.carto) {
      map.moveLayer('bbls');
      map.off('data', this.onMapStyleLoaded)
    }
  }
}