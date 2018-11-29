import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';

export default class ProjectShowPublicSchoolsController extends Controller {
  'public-schools' = service();
  router = service();
  
  @alias('model.project') project;
  @alias('model.publicSchoolsAnalysis') analysis;

  @computed('router.currentRouteName')
  showMap() {
    const current = this.get('router.currentRouteName')
    return (current.includes('existing-conditions') || current.includes('no-action'));
  }
}
