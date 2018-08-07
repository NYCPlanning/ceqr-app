import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  transportation: service(),
  'schools-capacity': service()
});
