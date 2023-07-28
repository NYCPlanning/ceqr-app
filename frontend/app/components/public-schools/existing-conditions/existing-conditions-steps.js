import Component from '@ember/component';
import { computed } from '@ember/object';

export default class PublicSchoolsExistingConditionsSteps extends Component {
  tagName = '';
  @computed(
    'analysis.{subdistrictsFromDb.length,esSchoolChoice,isSchoolChoice}',
    function () {
      return (
        this.analysis.esSchoolChoice ||
        this.analysis.isSchoolChoice ||
        this.analysis.subdistrictsFromDb.length > 1
      );
    }
  )
  displayWarning;
}
