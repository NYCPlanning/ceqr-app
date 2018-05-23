import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({  
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  defaultText: null,

  didReceiveAttrs() {
    this._super(...arguments);
    const data = this.get('data');
    if (data) {
      this.set('activeSdId', (data[0].sdId).toString());
      this.set('defaultText', `District ${data[0].district} - Subdistrict ${data[0].subdistrict}`);
    }
  },

  table: computed('activeSdId', 'activeSchoolsLevel', function() {
    let subdistrict = this.get('data').findBy('sdId', parseInt(this.get('activeSdId')));    
    return subdistrict[this.get('activeSchoolsLevel')];
  }),

});
