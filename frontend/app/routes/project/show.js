import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  controllerName: 'project',

  async model(params) {
    const project = await this.get('store').findRecord(
      'project',
      params.id,
      { include: [
          'public-schools-analysis',
          'transportation-analysis',
          'community-facilities-analysis',
          'solid-waste-analysis'
        ].join(',')
      }
    );

    return RSVP.hash({
      project
    });
  },
});