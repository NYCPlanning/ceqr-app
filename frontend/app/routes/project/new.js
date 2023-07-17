import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  controllerName: 'edit-project',

  currentUser: service(),
  'project-orchestrator': service(),

  async model() {
    const project = await this.store.createRecord('project');
    const mapplutoVersions = await this.store.query('data-package', {
      filter: { package: 'mappluto' },
    });

    project.set('dataPackage', mapplutoVersions.firstObject);

    return RSVP.hash({
      project,
      mapplutoVersions,
    });
  },

  actions: {
    async createProject(changeset) {
      await changeset.validate();

      if (!changeset.isValid) return;

      this.get('project-orchestrator').set('changeset', changeset);
      this.get('project-orchestrator.createProject').perform();
    },
  },
});
