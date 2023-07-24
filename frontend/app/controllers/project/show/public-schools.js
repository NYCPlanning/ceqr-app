import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class ProjectShowPublicSchoolsController extends Controller {
  @service() router;

  @alias('model.project') project;

  @alias('model.publicSchoolsAnalysis') analysis;

  @computed('router.currentRouteName')
  get showMap() {
    const current = this.router.currentRouteName;
    return (
      current.includes('existing-conditions') || current.includes('no-action')
    );
  }
}
