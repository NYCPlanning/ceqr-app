import Service from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember-decorators/service';
import { debug } from '@ember/debug';

export default class ProjectOrchestratorService extends Service {
  @service 'public-schools';
  @service router;

  @task
  *createProject() {    
    try {        
      const project = yield this.get('changeset').save();
      const publicSchoolsAnalysis = yield project.publicSchoolsAnalysis;

      this.get('public-schools').set('analysis', publicSchoolsAnalysis);
      yield this.get('public-schools.initialLoad').perform();

      this.router.transitionTo('project.show', project.id);
    } catch(err) {
      debug(err);
    }
  }
}
