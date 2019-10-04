import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowTransportationTdfPlanningFactorsShowRoute extends Route {
  async model(params) {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactor = await this.get('store').findRecord(
      'transportation-planning-factor',
      params.transportation_planning_factor_id
    )

    return RSVP.hash({
      project,
      transportationAnalysis,
      transportationPlanningFactor
    });
  }
}
