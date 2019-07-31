import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  
  actions: {
    async changeDataPackage(dataPackage) {
      const analysis = await this.analysis;

      analysis.set('dataPackage', dataPackage);

      await analysis.save();
    },
  }
});