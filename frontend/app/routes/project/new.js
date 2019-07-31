import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
// import { debug } from '@ember/debug';

export default Route.extend({
  controllerName: 'edit-project',
  
  currentUser: service(),
  'project-orchestrator': service(),
  
  async model() {
    const project = await this.store.createRecord('project');

    return RSVP.hash({ project });
  },

  actions: {
    createProject: async function(changeset) {      
      await changeset.validate();

      if (!changeset.isValid) return;
      
      this.get('project-orchestrator').set('changeset', changeset);
      this.get('project-orchestrator.createProject').perform();
    },
  }
});
