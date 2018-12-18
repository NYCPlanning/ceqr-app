import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  router: service(),
  
  currentChapter: computed('router.currentRouteName', function() {
    const current = this.get('router.currentRouteName');

    if (current.includes('public-schools')) return 'public-schools';
    if (current.includes('transportation')) return 'transportation';
    return null;
  }),

  onSummary: computed('router.currentRouteName', function() {
    return (this.get('router.currentRouteName').includes('summary'));
  }),

  actions: {
    gotoChapter(chapter) {      
      this.router.transitionTo(`project.show.${chapter}`, this.project.id);
    }
  }
});
