import Component from '@ember/component';

/**
 * This component, given a transportation analysis model (analysis), and selected feature array
 * (from Mapbox::FeatureSelector) will toggle the given feature, identified by
 * the 'geoid' property, in the model's study selection ('jtwStudySelection')
 */
export default class TransportationCensusTractsMapStudySelectionTogglerComponent extends Component {
  /**
   * The transportation-analysis Model, passed down from projects/show/transportation-analysis controller
   */
  analysis = {};

  /**
   * Array containing selected feature passed down from the Mapbox::FeatureSelector component.
   * Can be expected to only contain a single Feature object, as census tracts do not overlap,
   * so multiple census tracts cannot intersect a single click event point
   */
  selectedFeatureArray = [];


  /**
   * Census tract selection handling is triggered whenever bound property 'selectedFeatures' is updated
   */
  didUpdateAttrs() {
    this.toggleCensusTract(this.selectedFeatureArray);
  }

  /**
   * Method to handle feature selection; adds a selected feature geoid to the analysis'
   * jtwStudySelection array, or removes it if it already exists, and saves the analysis model
   * back to the server
   */
  async toggleCensusTract(selectedCensusTractFeatureArray) {
    const analysis = await this.factor.transportationAnalysis;
    
    const existingStudySelection = analysis.get('censusTractsSelection');
    const requiredStudySelection = analysis.get('requiredCensusTractsSelection');
    // check that selectedCensusTractFeature array exists and has an item
    if (selectedCensusTractFeatureArray && selectedCensusTractFeatureArray.length) {
      let { geoid } = selectedCensusTractFeatureArray[0].properties || {};
      // check that the feature has a geoid property and is not part of the required selection
      if(geoid && !requiredStudySelection.includes(geoid)) {
        if(existingStudySelection.includes(geoid)){
          existingStudySelection.removeObject(geoid);
        } else {
          existingStudySelection.pushObject(geoid);
        }
        await analysis.save();
        await this.factor.reload();
      }
    }
  }
}
