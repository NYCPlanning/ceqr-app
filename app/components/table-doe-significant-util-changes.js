import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('bldg_id', this.get('tables')[0].bldg_id)
  },
  
  buildingIds: computed('project.doeUtilChanges.[]', function() {
    return this.get('project.doeUtilChanges').mapBy('bldg_id').uniq();
  }),
  
  tables: computed('project.{doeUtilChanges,buildings}', function() {    
    return this.get('buildingIds').map(bldg_id => {
      return ({
        bldg_id,
        buildings: this.get('project.buildings').filterBy('bldg_id', bldg_id),
        doe_notices: this.get('project.doeUtilChanges').filterBy('bldg_id', bldg_id)
      })
    });
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
