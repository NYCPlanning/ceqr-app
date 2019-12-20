import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember-decorators/object';

export default class ProjectShowTransportationTdfPlanningFactorsRoute extends Route {
  async model() {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactors = await transportationAnalysis.get('transportationPlanningFactors');
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

      this.replaceWith('project.show.transportation.tdf.planning-factors.show', project.id, factor.id);
    }
  }

  @action
  error(error) {
    console.log("error from project/show/transportation/tdf/planning-factors: ", error); // eslint-disable-line
  }
}
