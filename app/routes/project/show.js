import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model(params) {
    const project = await this.store.findRecord('project', params.id);
    const manual = await this.store.findRecord('ceqr-manual/public-schools', project.manualVersion);

    project.set('manual', manual);
    
    return RSVP.hash({ project });
  },
});