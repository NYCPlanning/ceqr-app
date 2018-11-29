import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { debug } from '@ember/debug';

export default Route.extend({
  controllerName: 'edit-project',
  transportation: service(),
  'public-schools': service(),

  afterModel(model) {
    if (model.project.viewOnly) {
      this.transitionTo('project.show.public-schools.summary', model.project.id)
    }
  },

  actions: {
    save: async function(changeset) {                  
      await changeset.validate();

      if (!changeset.isValid) return;

      try {
        const project = await changeset.save();

        // this.get('transportation').set('project', this.get('controller.model.project'));
        // this.get('transportation.initialLoad').perform();

        this.get('public-schools').set('analysis', await project.publicSchoolsAnalysis);
        this.get('public-schools.initialLoad').perform();

        history.back();
      } catch(err) {
        debug(err);
      }
    },

    rollback: function(changeset) {
      return changeset.rollback();
    } 
  }
});