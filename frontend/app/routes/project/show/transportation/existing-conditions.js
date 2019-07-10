import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsRoute extends Route {

  redirect(model) {
    this.transitionTo('project.show.transportation.existing-conditions.census-tracts', model);
  }

  // sets up existing-conditions controller after redirect to `census-tracts` child route
  setupController(controller) {
    const { project } = this.modelFor('project/show');
    const transportationAnalysis = project.get('transportationAnalysis');

    controller.set('model', { project, transportationAnalysis });
  }
}
