import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { debug } from '@ember/debug';

export default Route.extend({
  controllerName: 'edit-project',
  transportation: service(),
  'schools-capacity': service(),

  afterModel(model) {
    if (model.project.viewOnly) {
      this.transitionTo('project.show.summary.schools-capacity', model.project.id)
    }
  },

  actions: {
    save: function(changeset) {                  
      changeset.validate().then(() => {
        if (changeset.get("isValid")) {
          changeset.save().catch(error => {
            debug(error);
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