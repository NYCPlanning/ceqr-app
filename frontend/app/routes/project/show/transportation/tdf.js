import Route from '@ember/routing/route';

export default class ProjectShowTransportationTdfRoute extends Route {
  
  // sets up existing-conditions controller after redirect to `census-tracts` child route
  async setupController(controller) {
    const { project } = this.modelFor('project/show');
    const transportationAnalysis = await project.get('transportationAnalysis');

    controller.set('model', { project, transportationAnalysis });
  }
}
