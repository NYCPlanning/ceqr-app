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

    return RSVP.hash({ project });
  },

  actions: {
    createProject: async function(changeset) {      
      await changeset.validate();

      if (!changeset.isValid) return;
      
      try {        
        const project = await changeset.save();
        
        // Load defaults for Public Schools Analysis
        const multipliers = await this.store.findRecord('ceqr-manual/public-schools', 'november-2018');
        const dataTables = await this.store.findRecord('data-tables/public-schools', 'november-2018');

        const publicSchoolsAnalysis = await this.store.createRecord('publicSchoolsAnalysis', {
          project,
          multipliers,
          dataTables
        });

        this.get('public-schools').set('analysis', publicSchoolsAnalysis);
        this.get('public-schools').initialLoad.perform();
        
        this.transitionTo('project.show', project.id);
      } catch(err) {
        debug(err);
      }
    },
  }
});
