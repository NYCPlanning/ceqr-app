import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, action, set } from '@ember/object';
import $ from 'jquery';

export default class ProjectUsersCompoent extends Component {
  tagName = '';
  classNames = ['project-users'];

  @service() store;
  @service() currentUser;

  didRender() {
    super.didRender(...arguments);
    super.didRender(...arguments);
    $('.ui.dropdown.user-edit').dropdown({
      on: 'hover',
    });
  }

  @computed.reads('project.viewers') projectViewers;

  @computed('currentUser.user.email', 'project.editors.[]', function () {
    return this.project.editors.filter(
      (u) => u.email !== this.currentUser.user.email
    );
  })
  projectEditors;

  reloadPermissions() {
    this.project.viewers.reload();
    this.project.editors.reload();
    this.project.projectPermissions.reload();
  }

  resetForm() {
    set(this, 'permission', null);
    set(this, 'email', null);
  }

  @action
  async addUser() {
    set(this, 'error', null);

    const results = await this.store.query('user', {
      filter: { email: this.email },
    });
    const user = results.firstObject;

    if (!user) {
      set(this, 'error', { message: 'Could not find user' });
      return;
    }

    const permissions = await this.project.projectPermissions;
    const userIds = permissions.mapBy('userId').uniq();

    if (userIds.includes(parseFloat(user.id))) {
      set(this, 'error', { message: 'Cannot add the same user twice' });
    } else {
      const pp = this.store.createRecord('project-permission', {
        userId: parseFloat(user.id),
        projectId: parseFloat(this.project.id),
        permission: this.permission,
      });

      await pp.save();
      this.reloadPermissions();
      this.resetForm();
    }
  }

  @action
  async removeUser(user) {
    set(this, 'error', null);

    const permissions = await this.project.projectPermissions;
    const pp = await permissions.findBy('userId', parseFloat(user.id));

    await pp.destroyRecord();
    this.reloadPermissions();
    this.resetForm();
  }

  @action
  async changeAccess(user, permission) {
    set(this, 'error', null);

    const permissions = await this.project.projectPermissions;
    const pp = await permissions.findBy('userId', parseFloat(user.id));

    pp.set('permission', permission);

    await pp.save();
    this.reloadPermissions();
    this.resetForm();
  }
}
