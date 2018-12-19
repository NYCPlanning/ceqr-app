import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  'public-schools': service(),
  
  actions: {
    async changeDataVersion(version) {
      const dataMultiplierMap = {
        "nov17": "march-2014",
        "nov18": "november-2018"
      }
      
      const analysis = await this.analysis;
      const dataTables = await this.store.findRecord('data-tables/public-schools', version);
      const multipliers = await this.store.findRecord('ceqr-manual/public-schools', dataMultiplierMap[version]);

      analysis.set('dataTables', dataTables);
      analysis.set('multipliers', multipliers);

      await analysis.save();

      this.get('public-schools').set('analysis', analysis);
      this.get('public-schools.initialLoad').perform();
    },

    async changeMultipliers(version) {
      const analysis = await this.analysis;
      const multipliers = await this.store.findRecord('ceqr-manual/public-schools', version);

      analysis.set('multipliers', multipliers);
      analysis.save();
    }
  }
});