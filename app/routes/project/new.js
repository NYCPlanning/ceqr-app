import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  controllerName: 'edit-project',
  
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
    createProject: function(changeset) {      
      changeset.validate().then(() => {
        if (changeset.get("isValid")) {
          changeset.save().catch(error => {
            console.log(error);
          }).then(() => {
            this.transitionTo('project.show', this.get('controller.model.project').id);
          });
        }
      });
    },
  }
});
