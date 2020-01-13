import Component from '@ember/component';
import { action } from '@ember/object';

/*
* This component provides to the parent an array of features that intersect the
* current mouse position.
* The parent can acquire that array of features either through this component's yield,
* or by passing to this action's onFeatures parameter a function that accepts the array.
*/
export default class MapboxFeatureHovererComponent extends Component {
  /** @param {Mapbox Map object} */
  map = {};
  /** @param {string} - id of carto-layer */
  layerId = '';
  /**
   * if specified, hovered features will be passed up to parent through this callback.
   * @function
   * @param {Array.<object>} features - array of features currently hovered over
   */
  onFeatures = () => {};
  
  @action
  setFeatures(features) {
    this.set('_features', features);
    this._passFeaturesToParent();
  }

  // private: features the mouse is currently above. 
  // The primary purpose of this component is to pass this array of features to the parent.
  _features = null;
  // private: current point location of mouse
  // As icing on the cake, component passes point of intersect up to parent.
  // However this only occurs if there is a new set of intersecting features.
  _point = null;

  _passFeaturesToParent(){
    if(this.onFeatures){
      this.onFeatures(this._features, this._point);
    }
  }

}
