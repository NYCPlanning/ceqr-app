import Component from '@ember/component';
import { computed, action } from '@ember-decorators/object';

export default class TransportationProjectMapComponent extends Component {
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

  @computed('analysis.jtwStudySelection.[]')
  get jtwStudySelectionComputed() {
    const selectedFeatures = this.get('analysis.jtwStudySelection') || [];
    return [...selectedFeatures];
  }
}
