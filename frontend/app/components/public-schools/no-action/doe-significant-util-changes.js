import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.analysis.doeUtilChangesPerBldg) this.set('bldg_id', this.analysis.doeUtilChangesPerBldg[0].bldg_id);
  },

  hasSigUtils: computed('analysis.doeUtilChangesPerBldg', function() {
    return this.analysis.doeUtilChangesPerBldg.length !== 0;
  }),

  actions: {
    showBldg(bldg_id) {
      this.set('bldg_id', bldg_id);
    },
    save() {
      this.set('saving', true);
      this.analysis.save().then(() => this.set('saving', false));
    },
  },

  /*
  [
    {
      bldg_id: 'K298',
      buildings: [** all buildings with id],
      doe_notices: [** all notices with id]
    }
  ]
  */
});
