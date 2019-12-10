import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowTransportationTdfTripResultsRoute extends Route {
  async model() {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactors = await transportationAnalysis.transportationPlanningFactors;

    return RSVP.hash({
      project,
      transportationAnalysis,
      transportationPlanningFactors
    });
  }

  afterModel(model) {
    if (model.transportationPlanningFactors.length) {
      const project = model.project;
      const factor  = model.transportationPlanningFactors.firstObject;

      this.replaceWith('project.show.transportation.tdf.trip-results.show', project.id, factor.id);
    }
  }
}
