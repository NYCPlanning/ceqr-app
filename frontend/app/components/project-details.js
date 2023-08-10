import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ProjectDetailsComponent extends Component {
  tagName = '';
  @service() projectOrchestrator;

  buildYearRange = Array.from({ length: 2040 - 2018 }, (v, k) => k + 2018);

  save() {}

  @action
  saveProject() {
    console.info('saveProject');
    this.save(this.project);
  }

  @action
  back() {
    console.info('back');
    history.back();
  }
}
