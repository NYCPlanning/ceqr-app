import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsRoute extends Route {
  controllerName = 'project';

  redirect(model) {
    this.transitionTo('project.show.transportation.existing-conditions.census-tracts', model.project.id);
  }
}
