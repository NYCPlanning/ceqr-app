import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({  
  transportation: service(),
  'public-schools': service(),
  router: service(),

  project: computed.alias('model.project'),

  showMap: computed('router.currentRouteName', function() {
    const current = this.get('router.currentRouteName')
    return (current.includes('existing-conditions') || current.includes('no-action'));
  }),
});
