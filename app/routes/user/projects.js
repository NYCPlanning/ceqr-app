import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({
  currentUser: service(),

  async model() {
    await this.currentUser.load();
    return this.store.findRecord('user', this.get('currentUser.user.id'), {include: 'projects'}).then(function(user) {
      return user.projects.filterBy('isNew', false);
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
