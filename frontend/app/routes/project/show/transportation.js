import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowTransportationRoute extends Route {

  async setupController(controller, model) {
    const { project } = this.modelFor('project/show');
    const transportationAnalysis = await project.get('transportationAnalysis');

    controller.set('model', { project, transportationAnalysis });
    controller.set('projectCtrl', this.controllerFor('project'));
  }
}
