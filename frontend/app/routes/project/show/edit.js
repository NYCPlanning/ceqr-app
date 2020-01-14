import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  controllerName: 'edit-project',
  'project-orchestrator': service(),

  afterModel(model) {
    if (model.project.viewOnly) {
      this.transitionTo('project.show.public-schools.summary', model.project.id);
    }
  },

  actions: {
    async save(changeset) {
      await changeset.validate();

      if (!changeset.isValid) return;

      this.get('project-orchestrator').set('changeset', changeset);
      this.get('project-orchestrator.saveProject').perform();
    },

    rollback(changeset) {
      return changeset.rollback();
    },
  },
});
