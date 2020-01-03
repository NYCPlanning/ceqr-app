import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({
  currentUser: service(),

  async model() {
    return this.store.findAll('project', { reload: true }).then(function(projects) {
      return projects.filterBy('isNew', false);
    });
  },

  afterModel(model) {
    // if a user has NOT created any projects, reroute them to the intro page
    if (model.length < 1) {
      this.transitionTo('ceqr-intro-page');
    }
  },

  actions: {
    deleteModal(id) {
      this.set('deleteProjectId', id);
      $('.mini.modal').modal('show');
    },
    deleteProject() {
      const id = this.get('deleteProjectId');
      this.get('store')
        .findRecord('project', id, { backgroundReload: false })
        .then(p => p.destroyRecord())
        .then(() => this.refresh());
    }
  }
});
