import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';

export default class ProjectShowEditRoute extends Route {
  controllerName = 'edit-project';
  @service projectOrchestrator;

  afterModel(model) {
    if (model.project.viewOnly) {
      this.transitionTo(
        'project.show.public-schools.summary',
        model.project.id
      );
    }
  }

  @action
  async save(changeset) {
    await changeset.validate();

    if (!changeset.isValid) return;

    set(this.projectOrchestrator, 'changeset', changeset);
    this.projectOrchestrator?.saveProject.perform();
  }

  @action
  rollback(changeset) {
    return changeset.rollback();
  }
}
