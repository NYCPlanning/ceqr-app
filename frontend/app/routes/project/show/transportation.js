import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowTransportationRoute extends Route {
  async model() {
    const { project } = this.modelFor('project/show');
    const transportationAnalysis = await project.get('transportationAnalysis');

    return RSVP.hash({
      project,
      transportationAnalysis
    });
  }
}
