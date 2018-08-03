import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class ProjectNewRoute extends Route {
  session = service();
  
  model = async function(params) {
    const project = await this.store.createRecord('project');
    const ceqrManual = await this.get('store').findRecord('ceqr-manual', 'march-2014');

    project.setCeqrManual(ceqrManual);
    project.set('user', this.get('session.uid'))
    
    return RSVP.hash({
      project,
      ceqrManual,
    });
  };

  actions = {
    createProject: function() {
      this.get('model.project').save().catch(error => {
        console.log(error);
      }).then((project) => {
        this.transitionToRoute('project.show', this.get('model.project.id'));
      });
    },
  };
  
  controllerName = 'project';
};