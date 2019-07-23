import Route from '@ember/routing/route';

export default class ProjectShowTransportationRoute extends Route {

  redirect(model) {
    this.transitionTo('project.show.transportation.analysis-threshold', model);
  }

  async setupController(controller) {
    const { project } = this.modelFor('project/show');
    const transportationAnalysis = await project.get('transportationAnalysis');

    controller.set('model', { project, transportationAnalysis });
    controller.set('projectCtrl', this.controllerFor('project'));
  }
}
