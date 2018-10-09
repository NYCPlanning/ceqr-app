import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({
  currentUser: service(),

  async model() {
    return this.store.findAll('project').then(function(projects) {
      return projects.filterBy('isNew', false);
    });
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
