import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({  
  transportation: service(),
  'schools-capacity': service(),

  project: alias('model.project'),
  ceqrManual: alias('model.ceqrManual'),
});
