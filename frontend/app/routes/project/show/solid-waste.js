import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class ProjectShowSolidWasteRoute extends Route {
  async model() {
    const { project } = this.modelFor('project/show');
    const solidWasteAnalysis = await project.get('solidWasteAnalysis');

    return RSVP.hash({
      project,
      solidWasteAnalysis
    });
  }
}
