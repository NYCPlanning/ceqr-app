import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model(params) {
    const project = await this.get('store').findRecord('project', params.id);

    return RSVP.hash({
      project
    });
  },
});