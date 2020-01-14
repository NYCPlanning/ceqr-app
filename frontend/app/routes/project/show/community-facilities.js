import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowCommunityFacilitiesRoute extends Route {
  controllerName = 'project';

  async model() {
    const { project, communityFacilitiesAnalysis } = this.modelFor('project/show');

    return RSVP.hash({
      project,
      communityFacilitiesAnalysis,
    });
  }
}
