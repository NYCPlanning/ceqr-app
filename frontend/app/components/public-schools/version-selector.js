import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  'public-schools': service(),

  dataOutdated: computed('analysis.dataVersion', function() {
    return this.analysis.dataVersion !== 'november-2018-q2';
  }),
  
  actions: {
    async changeDataVersion(version) {
      const dataMultiplierMap = {
        "november-2017": "march-2014",
        "november-2018": "november-2018",
        "november-2018-q2": "november-2018",
      }
      
      const analysis = await this.analysis;
      const dataTables = await this.store.findRecord('data-tables/public-schools', version);
      const multipliers = await this.store.findRecord('ceqr-manual/public-schools', dataMultiplierMap[version]);

      analysis.set('dataTables', dataTables);
      analysis.set('multipliers', multipliers);

      await analysis.save();

      this.get('public-schools').set('analysis', analysis);
      this.get('public-schools.fullReload').perform();
    },

    async changeMultipliers(version) {
      const analysis = await this.analysis;
      const multipliers = await this.store.findRecord('ceqr-manual/public-schools', version);

      analysis.set('multipliers', multipliers);
      analysis.save();
    }
  }
});