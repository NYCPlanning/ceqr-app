import Service from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember-decorators/service';
import { debug } from '@ember/debug';

export default class ProjectOrchestratorService extends Service {
  @service router;

  @task
  *createProject() {    
    try {        
      const project = yield this.get('changeset').save();

      this.router.transitionTo('project.show', project.id);
    } catch(err) {
      debug(err);
    }
  }
}
