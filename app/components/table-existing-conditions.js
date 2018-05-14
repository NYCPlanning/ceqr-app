import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  defaultText: null,
  
  didReceiveAttrs() {
    this._super(...arguments);
    const results = this.get('results');
    if (results) {
      this.set('activeSdId', (results[0].sdId).toString());
      this.set('defaultText', `District ${results[0].district} - Subdistrict ${results[0].subdistrict}`);
    }
  },

  // didRender() {
  //   this._super(...arguments);
  //   const results = this.get('results');
  //   if (results) this.set('activeSdId', (results[0].sdId).toString());
  // },

  table: computed('activeSdId', function() {
    if (isEmpty(this.get('results'))) return {};
    return this.get('results').findBy('sdId', parseInt(this.get('activeSdId')));
  })
});
