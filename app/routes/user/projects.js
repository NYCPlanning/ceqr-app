import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Route.extend({
  session: service(),

  model() {
    return this.store.query('project', {
      orderBy: 'user',
      equalTo: this.get('session.uid'),
    }).then(function(list) {
      return list.filterBy('isNew', false);
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
        .then(p => p.destroyRecord());
      this.refresh();
    }
  }
});
