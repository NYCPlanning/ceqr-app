import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TopBarComponent extends Component {
  tagName = '';
  @service() session;
  @service() currentUser;

  @action
  saveProject() {
    this.project.save();
  }

  @action
  logOut() {
    this.session.invalidate();
  }
}
