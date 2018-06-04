import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tables: computed('project.subdistricts.[]', function() {
    let tables = this.get('project.subdistricts').map((sd) => {
      let buildings = this.get('project.scaProjects').filter(
        (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict)
      );
      
      if (isEmpty(buildings)) return null;
      return {
        ...sd,
        buildings
      };
    });
    
    return tables.compact();
  })
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
