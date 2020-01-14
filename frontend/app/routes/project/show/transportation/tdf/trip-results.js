import RSVP from 'rsvp';
import ScrollableRoute from '../../../../scrollable-route';

export default class ProjectShowTransportationTdfTripResultsRoute extends ScrollableRoute {
  async model() {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactors = await transportationAnalysis.transportationPlanningFactors;

    return RSVP.hash({
      project,
      transportationAnalysis,
      transportationPlanningFactors,
    });
  }

  afterModel(model) {
    if (model.transportationPlanningFactors.length) {
      const { project } = model;
      const factor = model.transportationPlanningFactors.firstObject;

      this.replaceWith('project.show.transportation.tdf.trip-results.show', project.id, factor.id);
    }
  }
}
