import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsIndexRoute extends Route {

  redirect(model) {
    this.transitionTo('project.show.transportation.existing-conditions.census-tracts', model);
  }

}
