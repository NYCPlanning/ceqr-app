import Component from '@ember/component';

export default class ProjectProjectAreaSelectionTogglerComponent extends Component {
  /**
   * Array containing selected feature passed down from the Mapbox::FeatureSelector component.
   * Can be expected to only contain a single Feature object, as tax lots do not overlap,
   * so multiple lots cannot intersect a single click event point
   */
  selectedBbls = [];

  project = {};

  /**
   * Toggle study area selection handling is triggered whenever bound property 'selectedFeatures' is updated
   */
  didUpdateAttrs() {
    this.toggleBbls(this.selectedBbls);
  }

  toggleBbls(selectedFeatures) {
    const feature = selectedFeatures.firstObject;
    const { bbl } = feature.properties;

    this.toggleBbl(bbl);
  }
}
