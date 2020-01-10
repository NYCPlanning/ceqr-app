import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  classNames: ['project-users'],

  store: service(),
  currentUser: service(),

  didRender() {
    $('.ui.dropdown.user-edit').dropdown({
      on: 'hover',
    });
  },

  projectViewers: computed('project.viewers.@each', function() {
    return this.project.viewers;
  }),

  projectEditors: computed('project.editors.@each', function() {
    return this.project.editors.filter((u) => u.email !== this.currentUser.user.email);
  }),

  reloadPermissions() {
    this.project.viewers.reload();
    this.project.editors.reload();
    this.project.projectPermissions.reload();
  },

  resetForm() {
    this.set('permission', null);
    this.set('email', null);
  },

  actions: {
    async addUser() {
      this.set('error', null);

      const results = await this.store.query('user', { filter: { email: this.email } });
      const user = results.firstObject;

      if (!user) {
        this.set('error', { message: 'Could not find user' });
        return;
      }

      const permissions = await this.project.projectPermissions;
      const userIds = permissions.mapBy('userId').uniq();

      if (userIds.includes(parseInt(user.id))) {
        this.set('error', { message: 'Cannot add the same user twice' });
      } else {
        const pp = this.store.createRecord('project-permission', {
          userId: parseInt(user.id),
          projectId: parseInt(this.project.id),
          permission: this.permission,
        });

        await pp.save();
        this.reloadPermissions();
        this.resetForm();
      }
    },
    async removeUser(user) {
      this.set('error', null);

      const permissions = await this.project.projectPermissions;
      const pp = await permissions.findBy('userId', parseInt(user.id));

      await pp.destroyRecord();
      this.reloadPermissions();
      this.resetForm();
    },
    async changeAccess(user, permission) {
      this.set('error', null);

      const permissions = await this.project.projectPermissions;
      const pp = await permissions.findBy('userId', parseInt(user.id));

      pp.set('permission', permission);

      await pp.save();
      this.reloadPermissions();
      this.resetForm();
    },
  },
});
