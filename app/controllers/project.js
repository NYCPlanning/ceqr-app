import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  project: alias('model.project'),
  ceqrManual: alias('model.ceqrManual'),
  
  actions: {
    saveProject: function() {
      this.get('model.project').save();
    }
  }
});
