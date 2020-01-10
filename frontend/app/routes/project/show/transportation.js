import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowTransportationRoute extends Route {
  controllerName = 'project';

  async model() {
    const { project, transportationAnalysis } = this.modelFor('project/show');

    return RSVP.hash({
      project,
      transportationAnalysis,
    });
  }
}
