import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  mapdata: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    this.get('mapdata').setProject(this.get('project'));
  }, 
});
