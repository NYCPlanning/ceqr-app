import Component from '@ember/component';
import { computed, action, set } from '@ember/object';

export default class PublicSchoolsExistingConditionsRecentBuiltComponent extends Component {
  tagName = '';
  // ceqr_school_buildings dataset is a combination of two datasets with different metadata: lcgms dataset and bluebook dataset
  @computed(
    'analysis.dataPackage.schemas.ceqr_school_buildings.sources',
    function () {
      return this.analysis.dataPackage.schemas.ceqr_school_buildings.sources.find(
        (source) => source.name === 'lcgms'
      );
    }
  )
  lcgmsMetadata;

  @action
  save() {
    console.log('save recently built schools');
    set(this, 'saving', true);
    this.project.save().then(() => set(this, 'saving', false));
  }
}
