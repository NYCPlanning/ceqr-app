import Service, { inject as service } from '@ember/service';
import { task, taskGroup } from 'ember-concurrency-decorators';
import { debug } from '@ember/debug';

export default class ProjectOrchestratorService extends Service {
  @service router;

  @taskGroup projectTask;

  @task({ group: 'projectTask' })* createProject() {
    try {
      const project = yield this.get('changeset').save();

      this.router.transitionTo('project.show', project.id);
    } catch (err) {
      debug(err);
    }
  }

  @task({ group: 'projectTask' })* saveProject() {
    try {
      const project = yield this.get('changeset').save();
      // ensure changes to analyses triggered by project updates are reloaded
      const transportationAnalysis = yield project.transportationAnalysis.reload();
      yield transportationAnalysis.transportationPlanningFactors.reload();
      yield transportationAnalysis.transportationPlanningFactors;

      yield project.publicSchoolsAnalysis.reload();
      yield project.communityFacilitiesAnalysis.reload();

      history.back();
    } catch (err) {
      debug(err);
    }
  }

  @task({ group: 'projectTask' })* saveAnalysis() {
    yield this.get('analysis').save();
  }
}
