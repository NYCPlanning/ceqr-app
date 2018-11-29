import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  'public-schools': service(),
  store: service(),

  didRender() {
    $('.dropdown').dropdown();
  },

  actions: {
    async changeMultipliers(version) {
      const analysis = await this.analysis;
      const multipliers = await this.store.findRecord('ceqr-manual/public-schools', version);

      analysis.set('multipliers', multipliers);
      analysis.save();
    }
  }
});
