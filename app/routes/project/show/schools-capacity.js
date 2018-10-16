import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'project',

  afterModel(model) {
    if (model.project.viewOnly) {
      this.transitionTo('project.show.summary.schools-capacity', model.project.id)
    }
  }
});