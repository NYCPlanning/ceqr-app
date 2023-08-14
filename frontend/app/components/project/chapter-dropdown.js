import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default class ProjectChapterDropdownComponent extends Component {
  tagName = '';
  @service router;

  @computed('router.currentRouteName')
  get currentChapter() {
    const current = this.router.currentRouteName;

    if (current.includes('public-schools')) return 'public-schools';
    if (current.includes('transportation')) return 'transportation';
    if (current.includes('community-facilities')) return 'community-facilities';
    return null;
  }

  @action
  gotoChapter(chapter) {
    console.info('gotoChapter', chapter);
    this.router.transitionTo(`project.show.${chapter}`, this.project.id);
  }
}
