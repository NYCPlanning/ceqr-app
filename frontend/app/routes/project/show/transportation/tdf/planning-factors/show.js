import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember-decorators/object';

export default class ProjectShowTransportationTdfPlanningFactorsShowRoute extends Route {
  async model(params) {
    const { project, transportationAnalysis } = this.modelFor('project/show');
    const transportationPlanningFactor = await this.get('store').findRecord(
      'transportation-planning-factor',
      params.transportation_planning_factor_id, 
      { include: 'data-package' }
    )
    const dataPackage = transportationPlanningFactor.get('dataPackage');
    const availablePackages = await this.get('store').query('data-package', {
      filter: {
        package: dataPackage.get('package'),
      }
    });

    return RSVP.hash({
      project,
      transportationAnalysis,
      transportationPlanningFactor,
      availablePackages
    });
  }

  @action
  error(error) {
    console.log("error from project/show/transportation/tdf/planning-factors/show: ", error); // eslint-disable-line
  }
}
