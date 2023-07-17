import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  displayWarning: computed(
    'analysis.subdistrictsFromDb.length',
    'analysis.{esSchoolChoice,isSchoolChoice}',
    function () {
      return (
        this.analysis.esSchoolChoice ||
        this.analysis.isSchoolChoice ||
        this.analysis.subdistrictsFromDb.length > 1
      );
    }
  ),
});
