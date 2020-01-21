import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  'project-orchestrator': service(),

  actions: {
    async changeDataPackage(dataPackage) {
      const analysis = await this.analysis;

      analysis.set('dataPackage', dataPackage);

      this['project-orchestrator'].set('analysis', analysis);
      this.get('project-orchestrator.saveAnalysis').perform();
    },
  },
});
