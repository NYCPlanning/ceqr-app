import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';

export default class TransportationTripGenerationMapComponent extends Component {
  /**
   * The transportation-analysis Model, passed down from the project/show/transportation-analysis controller
   */
  analysis = {};

  /**
   * The identifier (geoid) of the currenlty hovered feature in the map
   */
  hoveredFeatureId = null;

  /**
   * Sets hoveredFeatureId to geoid of the first feature in features array argument
   */
  @action
  setFirstHoveredFeatureId(features){
    if(features && features.length && features[0]){
      this.set('hoveredFeatureId', features[0].properties.geoid);
    } else {
      this.set('hoveredFeatureId', null);
    }
  }

    /**
   * The composite array of all highlighted features, including:
   * - currently hovered feature
   * - user-selected study selection features
   * - required study selection features
   * which is passed to the highlight layer's FeatureFilterer
   */
  @computed('hoveredFeatureId', 'analysis.{jtwStudySelection.[],requiredJtwStudySelection.[]}')
  get highlightedFeatureIds() {
    const { hoveredFeatureId } = this;
    const selectedFeatures = this.get('analysis.jtwStudySelection') || [];
    const requiredSelectedFeatures = this.get('analysis.requiredJtwStudySelection') || [];

    return [hoveredFeatureId, ...selectedFeatures, ...requiredSelectedFeatures];
  }

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
