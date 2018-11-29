import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  didRender() {
    this._super(...arguments);
    this.$('.progress').progress();
    this.$('.progress').popup();
  },

  tables: computed('analysis.subdistricts.[]', function() {
    let tables = this.get('analysis.subdistricts').map((sd) => {
      let buildings = this.get('analysis.scaProjects').filter(
        (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict)
      );
      
      if (isEmpty(buildings)) return null;
      return {
        ...sd,
        buildings
      };
    });
    
    return tables.compact();
  }),

  actions: {
    save: function() {
      this.set('saving', true);
      this.get('analysis').save().then(() => this.set('saving', false));
    },
  }
});
