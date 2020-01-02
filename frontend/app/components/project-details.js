import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  'project-orchestrator': service(),

  notificationMessages: service(),

  buildYearRange: Array.from({length: (2040 - 2018)}, (v, k) => k + 2018),

  // noop
  save() { return; },

  actions: {
    // "save" is a passed in action
    save() {
      this.get('save')(this.get('project'));
      // notify the user that the project has been saved
      this.get('notificationMessages').success('Project Saved!', {
        autoClear: true,
        clearDuration: 1500,
        cssClasses: 'project-details-saved-message'
      });
    },
    back() {
      history.back();
    }
  }
});
