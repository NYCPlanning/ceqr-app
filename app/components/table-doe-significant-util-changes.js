import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.get('hasSigUtils')) this.set('bldg_id', this.get('tables')[0].bldg_id)
  },
  
  buildingIds: computed('project.doeUtilChanges.[]', function() {
    return this.get('project.doeUtilChanges').mapBy('bldg_id').concat(
      this.get('project.doeUtilChanges').mapBy('bldg_id_additional')
    ).without('').uniq();
  }),
  
  tables: computed('project.{doeUtilChanges,buildings}', function() {    
    const buildingsNoHs = this.get('project.buildings').filter(b => (b.level !== 'hs'));
    
    return this.get('buildingIds').map(bldg_id => {      
      const buildings = buildingsNoHs.filterBy('bldg_id', bldg_id);

      if (buildings.length === 0) return;
      
      return ({
        bldg_id,
        buildings,
        doe_notices: this.get('project.doeUtilChanges').filter(b => (
          b.bldg_id === bldg_id || b.bldg_id_additional === bldg_id
        ))
      })
    }).compact();
  }),

  hasSigUtils: computed('tables', function() {
    return this.get('tables').length !== 0; 
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
