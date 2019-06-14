import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { action, computed } from '@ember-decorators/object';

export default class ProjectChapterDropdownComponent extends Component {
  @service router;

  @computed('router.currentRouteName')
  get currentChapter() {
    const current = this.get('router.currentRouteName');

    if (current.includes('public-schools')) return 'public-schools';
    if (current.includes('transportation')) return 'transportation';
    if (current.includes('community-facilities')) return 'community-facilities';
    return null;
  }

  @action
  gotoChapter(chapter) {      
    this.router.transitionTo(`project.show.${chapter}`, this.project.id);
  }
}
