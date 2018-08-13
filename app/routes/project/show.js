import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model(params) {
    const project = await this.get('store').findRecord('project', params.ceqr_number);
    const ceqrManual = await this.get('store').findRecord('ceqr-manual', 'march-2014');

    project.setCeqrManual(ceqrManual);
    
    return RSVP.hash({
      project,
      ceqrManual,
    });
  },
});