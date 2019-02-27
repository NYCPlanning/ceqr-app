import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  'project-orchestrator': service(),

  buildYearRange: Array.from({length: (2040 - 2018)}, (v, k) => k + 2018),

  actions: {
    save() {
      this.get('save')(this.get('project'));
    },
    back() {
      history.back();
    }
  }
});
