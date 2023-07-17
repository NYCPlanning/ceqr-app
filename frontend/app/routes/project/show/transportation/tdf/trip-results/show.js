import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';

export default class ProjectShowTransportationTdfTripResultsShowRoute extends Route {
  async model(params) {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactor = await this.store.findRecord(
      'transportation-planning-factor',
      params.transportation_planning_factor_id
    );

    return RSVP.hash({
      project,
      transportationAnalysis,
      transportationPlanningFactor,
    });
  }

  @action
  error({ errors }, transition) {
    const fourohfour = errors.findBy('code', '404');
    const projectId = transition.params['project.show'].id;

    if (fourohfour) {
      this.replaceWith(
        'project.show.transportation.tdf.trip-results',
        projectId
      );
    }
  }
}
