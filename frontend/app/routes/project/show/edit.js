import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { debug } from '@ember/debug';

export default Route.extend({
  controllerName: 'edit-project',

  'project-orchestrator': service(),

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
        // ensure changes to analyses triggered by project updates are reloaded
        await project.transportationAnalysis.reload();
        await project.publicSchoolsAnalysis.reload();

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
