import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

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

      this.get('project-orchestrator').set('changeset', changeset);
      this.get('project-orchestrator.saveProject').perform();
    },

    rollback: function(changeset) {
      return changeset.rollback();
    }
  }
});
