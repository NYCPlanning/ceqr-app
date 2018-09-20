import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
  controllerName: 'edit-project',
  
  currentUser: service(),
  transportation: service(),
  'schools-capacity': service(),
  
  async model() {
    const project = await this.store.createRecord('project');
    const ceqrManual = await this.get('store').findRecord('ceqr-manual', 'march-2014');
    const user = this.get('currentUser.user');

    project.setCeqrManual(ceqrManual);
    project.set('users', [ user ]);
    
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
            this.get('transportation').set('project', this.get('controller.model.project'));
            this.get('transportation.initialLoad').perform();

            this.get('schools-capacity').set('project', this.get('controller.model.project'));
            this.get('schools-capacity.initialLoad').perform();
            
            this.transitionTo('project.show', this.get('controller.model.project').id);
          });
        }
      });
    },
  }
});
