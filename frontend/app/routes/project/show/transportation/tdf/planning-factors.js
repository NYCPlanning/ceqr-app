import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowTransportationTdfPlanningFactorsRoute extends Route {
  async model() {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactors = await transportationAnalysis.transportationPlanningFactors;

    return RSVP.hash({
      project,
      transportationAnalysis,
      transportationPlanningFactors
    });
  }
}
