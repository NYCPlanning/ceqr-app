import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import carto from 'carto-promises-utility/utils/carto';

import Building from '../decorators/Building';

export default Controller.extend({  
  project: alias('model.project'),
  ceqrManual: alias('model.ceqrManual'),

  actions: {        
    saveProjectDetails: async function() {
      let bbls = this.get('model.project.bbls');

      await this.get('model.project').save().catch(error => {
        console.log(error);
      }).then(() => {
        this.transitionToRoute('project.show.schools-capacity.existing-conditions', this.get('model.project.id'));
      });
    },

    saveExistingConditions: async function() {




      await this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.schools-capacity.no-action', project.id);
      });
    },

    saveNoAction: function() {
      this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show.schools-capacity.with-action', project.id);
      });
    }
  }
});
