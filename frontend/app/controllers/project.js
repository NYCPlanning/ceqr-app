import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({  
  transportation: service(),
  'public-schools': service(),
  router: service(),

  project: computed.alias('model.project'),

  onSummary: computed('router.currentRouteName', function() { 
    return this.router.currentRouteName.includes('summary');
  }),

  showAnalysisSteps: computed('onSummary', 'project.viewOnly', function() {
    return !(this.project.viewOnly || this.onSummary)
  }),

  showMap: computed('router.currentRouteName', function() {
    const current = this.router.currentRouteName;
    return (current.includes('existing-conditions') || current.includes('no-action'));
  }),
});
