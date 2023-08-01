import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default class ProjectController extends Controller{
  tagName = '';
  @service()router;

  @service()projectOrchestrator;

  @alias('model.project')project;

  @computed('router.currentRouteName', function () {
    return this.router.currentRouteName.includes('summary');
  })onSummary;

  @computed('onSummary', 'project.viewOnly', function () {
    return !(this.project.viewOnly || this.onSummary);
  })showAnalysisSteps;

  @computed('router.currentRouteName', function () {
    const current = this.router.currentRouteName;
    return (
      current.includes('existing-conditions') || current.includes('no-action')
    );
  })showMap;
};
