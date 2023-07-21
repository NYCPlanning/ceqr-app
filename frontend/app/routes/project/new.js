import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';

export default class ProjectNewRoute extends Route {
  controllerName = 'edit-project';

  @service() currentUser;
  @service projectOrchestrator;

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
  }

  @action
  async createProject(changeset) {
    await changeset.validate();

    if (!changeset.isValid) return;

    set(this.projectOrchestrator, 'changeset', changeset);
    this.projectOrchestrator?.createProject.perform();
  }
}
