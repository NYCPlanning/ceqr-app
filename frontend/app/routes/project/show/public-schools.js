import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model() {
    const { project } = this.modelFor('project/show');
    const publicSchoolsAnalysis = await project.publicSchoolsAnalysis;

    const availablePackages = this.store.query('data-package', { filter: { package: 'public_schools' } });  
    
    return RSVP.hash({
      project,
      publicSchoolsAnalysis,
      availablePackages
    });
  },

  afterModel(model) {  
    if (model.project.viewOnly) {
      this.transitionTo('project.show.public-schools.summary', model.project.id);
    }
  }
});