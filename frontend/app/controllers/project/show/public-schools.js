import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default class ProjectShowPublicSchoolsController extends Controller {
  router = service();

  @alias('model.project') project;

  @alias('model.publicSchoolsAnalysis') analysis;

  @computed('router.currentRouteName')
  showMap() {
    const current = this.get('router.currentRouteName');
    return (current.includes('existing-conditions') || current.includes('no-action'));
  }
}
