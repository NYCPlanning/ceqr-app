import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  'schools-capacity': service(),
  store: service(),

  actions: {
    async changeManualVersion(version) {
      this.project.set('manualVersion', version);

      const manual = await this.store.findRecord('ceqr-manual/public-schools', version);
      this.project.set('manual', manual);

      this.project.save();
    }
  }
});
