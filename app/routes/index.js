import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('project').then(function(list) {
      return list.filterBy('isNew', false);
    });
  }
});
