import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ProjectHeaderComponent extends Component {
  tagName = '';
  @service() router;

  @computed('router.currentRouteName', function () {
    return this.router.currentRouteName.includes('public-schools');
  })
  onPublicSchools;

  @computed('router.currentRouteName', function () {
    return this.router.currentRouteName.includes('summary');
  })
  onSummary;
}
