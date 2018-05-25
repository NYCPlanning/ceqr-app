import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({  
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  defaultText: null,

  didReceiveAttrs() {
    this._super(...arguments);
    const project = this.get('project');
    if (project) {
      this.set('activeSdId', (project.get('subdistricts')[0].id).toString());
      this.set('defaultText', `District ${project.get('subdistricts')[0].district} - Subdistrict ${project.get('subdistricts')[0].subdistrict}`);
    }
  },

  table: computed('activeSdId', 'activeSchoolsLevel', function() {
    return this.get('project.existingSchoolTotals').find(
      (total) => (total.id === parseInt(this.get('activeSdId')) && total.level === this.get('activeSchoolsLevel'))
    )
  }),
});
