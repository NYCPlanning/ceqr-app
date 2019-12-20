import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember-decorators/object';

export default class ProjectShowTransportationRoute extends Route {
  controllerName = 'project';
  
  async model() {
    const { project, transportationAnalysis } = this.modelFor('project/show');

    return RSVP.hash({
      project,
      transportationAnalysis
    });
  }

  @action
  error(error) {
    console.log("error from project/show/transportation: ", error); // eslint-disable-line
  }
}
