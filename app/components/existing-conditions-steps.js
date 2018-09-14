import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  studyAreaNotice: computed('project.{esSchoolChoice,isSchoolChoice,subdistrictsFromDB.[]}', function() {
    return (this.get('esSchoolChoice') || this.get('esSchoolChoice') || 
      (this.get('project.subdistrictsFromDb').length > 1)
    );
  }),
});
