import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowCommunityFacilitiesRoute extends Route {
  async model() {
    const { project } = this.modelFor('project/show');
    const communityFacilitiesAnalysis = await project.get('communityFacilitiesAnalysis');

    return RSVP.hash({
      project,
      communityFacilitiesAnalysis
    });
  }
}
