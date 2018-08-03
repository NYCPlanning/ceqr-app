import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),
  
  async model() {
    const project = await this.store.createRecord('project');
    const ceqrManual = await this.get('store').findRecord('ceqr-manual', 'march-2014');

    project.setCeqrManual(ceqrManual);
    project.set('user', this.get('session.uid'))
    
    return RSVP.hash({
      project,
      ceqrManual,
    });
  },

  actions: {
    createProject: function() {
      const project = this.get('controller.model.project');
      
      project.save().catch(error => {
        console.log(error);
      }).then(() => {
        this.transitionTo('project.show', project.id);
      });
    },
  }
});
