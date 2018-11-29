import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model() {
    const { project } = this.modelFor('project/show');
    const publicSchoolsAnalysis = await project.publicSchoolsAnalysis;

    return RSVP.hash({
      project,
      publicSchoolsAnalysis
    });
  },

  afterModel(model) {  
    if (model.project.viewOnly) {
      this.transitionTo('project.show.public-schools.summary', model.project.id);
    }
  }
});