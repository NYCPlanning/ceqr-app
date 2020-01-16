import Component from '@ember/component';
import { computed, action } from '@ember/object';
import mapboxgl from 'mapbox-gl';
import MapboxAccessibility from '@mapbox/mapbox-gl-accessibility';

/**
 * Helper function to ensure 'bbls' layer is the top-most layer. MapboxGL styleIsLoaded() check,
 * and 'style.load' events do not reliably indicate a fully loaded style object.
 * To display 'bbls' as the top-most layer, must move it with moveLayer()
 */
const onMapStyleLoaded = function(e) {
  const { target: map } = e;
  const style = map.getStyle();
  if (style.sources.bbls_geojson && style.sources.carto) {
    map.moveLayer('bbls');
    map.off('data', onMapStyleLoaded);
  }
};

export default class TransportationCensusTractsMapComponent extends Component {
  /**
   * Required
   */
  analysis = {};

  /**
   * The Project model
   */
  project = {};

  /**
   * The identifier (geoid) of the currenlty hovered feature in the map
  */
  hoveredFeatureId = null;

  /**
   * Flag for optionally displaying transit zones
   */
  showTransitZones = false;

  /**
   * Flag for optionally displaying land use
   */
  showLandUse = false;

  /**
   * Sets hoveredFeatureId to geoid of the first feature in features array argument
   */
  @action
  setFirstHoveredFeatureId(features) {
    if (features && features.length && features[0]) {
      this.set('hoveredFeatureId', features[0].properties.geoid);
    } else {
      this.set('hoveredFeatureId', null);
    }
  }

  /**
   * Computed property that enables feature filterer to receive array mutations in didReceiveAttrs()
   */
  // @computed('analysis.censusTractsSelection.[]')
  // get jtwStudySelectionComputed() {
  //   const selectedFeatures = this.get('analysis.censusTractsSelection') || [];
  //   return [...selectedFeatures];
  // }

  /**
   * Computed property that enables feature filterer to filter on required and normal study selection
   */
  @computed('analysis.{censusTractsSelection.[],requiredCensusTractsSelection.[]}')
  get completeCensusTractsSelection() {
    const selectedFeatures = this.get('analysis.censusTractsSelection') || [];
    const requiredFeatures = this.get('analysis.requiredCensusTractsSelection') || [];
    return [...selectedFeatures, ...requiredFeatures];
  }

  @computed('analysis.censusTractsCentroid')
  get censusTractsCentroidLngLat() {
    return this.analysis.get('censusTractsCentroid').features.firstObject.geometry.coordinates;
  }

  /**
   * Action to pass to the MapboxGL instance created by Mapbox::Basic map in this component's template
   */
  @action
  mapLoaded(map) {
    map.on('data', onMapStyleLoaded);

    map.addControl(new MapboxAccessibility({
      // A string value representing a property key in the data. This
      // will be used as the text in voiceover.
      accessibleLabelProperty: 'name',

      // The layers within the style that
      // 1. Contain the `accessibleLabelProperty` value as a key
      // 2. Should be used for voiceover.
      // 3. Will be represented in the DOM with nodes
      layers: [
        'bbls',
      ],
    }));

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  }
}
