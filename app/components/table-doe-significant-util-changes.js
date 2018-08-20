import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('project.doeUtilChangesPerBldg')) this.set('bldg_id', this.get('project.doeUtilChangesPerBldg')[0].bldg_id)
  },

  hasSigUtils: computed('project.doeUtilChangesPerBldg', function() {
    return this.get('project.doeUtilChangesPerBldg').length !== 0;
  }),

  actions: {
    showBldg(bldg_id) {
      this.set('bldg_id', bldg_id);
    },
    save: function() {
      this.set('saving', true);
      this.get('project').save().then(() => this.set('saving', false));
    }
  }

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
