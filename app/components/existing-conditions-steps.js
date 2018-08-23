import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  init() {
    this._super(...arguments)
    this.set('tab', 'schools');
  },

  studyAreaNotice: computed('project.{esSchoolChoice,isSchoolChoice,subdistrictsFromDB.[]}', function() {
    return (this.get('esSchoolChoice') || this.get('esSchoolChoice') || 
      (this.get('project.subdistrictsFromDB').length > 1)
    );
  }),

  actions: {
    setTab(tab) {
      this.set('tab', tab);
    }
  }
});
