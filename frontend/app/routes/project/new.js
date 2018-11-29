import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { debug } from '@ember/debug';

export default Route.extend({
  controllerName: 'edit-project',
  
  currentUser: service(),
  transportation: service(),
  'public-schools': service(),
  
  async model() {
    const project = await this.store.createRecord('project');
    const manual = await this.get('store').findRecord('ceqr-manual/public-schools', 'november-2018');
    const user = this.get('currentUser.user');

    project.set('manual', manual);
    project.set('users', [ user ]);
    
    return RSVP.hash({
      project
    });
  },

  actions: {
    createProject: function(changeset) {      
      changeset.validate().then(() => {
        if (changeset.get("isValid")) {
          changeset.save().catch(error => {
            debug(error);
          }).then(() => {
            this.get('transportation').set('project', this.get('controller.model.project'));
            this.get('transportation.initialLoad').perform();

            this.get('public-schools').set('project', this.get('controller.model.project'));
            this.get('public-schools.initialLoad').perform();
            
            this.transitionTo('project.show', this.get('controller.model.project').id);
          });
        }
      });
    },
  }
});
