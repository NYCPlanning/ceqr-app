import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class TransportationProjectMapComponent extends Component {
  /**
   * The transportation-analysis Model, passed down from the project/show/transportation-analysis controller
   */
  analysis = {};
  hoveredFeatureId = null;

  @action
  setFirstHoveredFeatureId(features){
    if(features && features.length && (features[0] != null)){
      this.set('hoveredFeatureId', features[0].properties.geoid);
    }
  }
}
