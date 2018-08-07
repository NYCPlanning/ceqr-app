import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  controllerName: 'edit-project',
  transportation: service(),
  'schools-capacity': service(),

  actions: {
    save: function(changeset) {                  
      changeset.validate().then(() => {
        if (changeset.get("isValid")) {
          changeset.save().catch(error => {
            console.log(error);
          }).then(() => {
            this.get('transportation').set('project', this.get('controller.model.project'));
            this.get('transportation.initialLoad').perform();

            this.get('schools-capacity').set('project', this.get('controller.model.project'));
            this.get('schools-capacity.initialLoad').perform();

            history.back();
          });
        }
      });
    },

    rollback: function(changeset) {
      return changeset.rollback();
    } 
  }
});