import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import { action, set } from '@ember/object';

export default class UserProjectsRoute extends Route {
  @service currentUser;

  async model() {
    return this.store
      .findAll('project', { reload: true })
      .then(function (projects) {
        return projects.filterBy('isNew', false);
      });
  }

  afterModel(model) {
    // if no projects are found, reroute them to the intro page
    if (model.length < 1) {
      this.transitionTo('ceqr-intro-page');
    }
  }

  @action
  deleteModal(id) {
    set(this, 'deleteProjectId', id);
    $('.mini.modal').modal('show');
  }

  @action
  deleteProject() {
    const id = this.deleteProjectId;
    this.store
      .findRecord('project', id, { backgroundReload: false })
      .then((p) => p.destroyRecord())
      .then(() => this.refresh());
  }
}
