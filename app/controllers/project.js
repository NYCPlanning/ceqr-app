import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({  
  transportation: service(),
  'schools-capacity': service(),
  router: service(),

  project: computed.alias('model.project'),
  ceqrManual: computed.alias('model.ceqrManual'),

  currentChapter: computed('router.currentRouteName', function() {
    const current = this.get('router.currentRouteName')

    if (current.includes('schools-capacity')) return 'schools-capacity';
    if (current.includes('transportation')) return 'transportation';
    return null;
  }),

  actions: {
    gotoChapter(chapter) {      
      this.get('router').transitionTo(`project.show.${chapter}`);
    }
  }
});
