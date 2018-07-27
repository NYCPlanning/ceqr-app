import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({  
  activeSchoolsLevel: 'ps',
  activeSdId: null,

  didReceiveAttrs() {
    this._super(...arguments);
    const project = this.get('project');
    if (project) {
      this.set('activeSdId', (project.get('subdistricts')[0].id).toString());
    }
  },

  didInsertElement() {
    // this.$('table').tablesort();
  },

  table: computed('activeSdId', 'activeSchoolsLevel', function() {
    if (this.get('activeSchoolsLevel') === 'hs') {
      return this.get('project.existingSchoolTotals').findBy('level', 'hs');
    } else {
      return this.get('project.existingSchoolTotals').find(
        (total) => (total.id === parseInt(this.get('activeSdId')) && total.level === this.get('activeSchoolsLevel'))
      );
    }
  }),

  buildings: computed('table', function() {
    return this.get('table.buildings').sortBy('org_id');
  }),

  sd: computed('activeSdId', function() {
    return this.get('project.subdistricts').findBy('id', parseInt(this.get('activeSdId')));
  }),

  actions: {
    setSdId: function(sdId) {
      this.set('activeSdId', sdId);
    }
  }
});
