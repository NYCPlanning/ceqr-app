import Route from '@ember/routing/route';

export default class ProjectShowTransportationAnalysisThresholdRoute extends Route {

  async setupController(controller) {
    const { project } = this.modelFor('project/show');
    const transportationAnalysis = await project.get('transportationAnalysis');

    controller.set('model', { project, transportationAnalysis });
    controller.set('projectCtrl', this.controllerFor('project'));
  }

}
