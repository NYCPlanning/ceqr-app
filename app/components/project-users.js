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
      on: 'hover'
    });
  },

  projectViewers: computed('project.viewers.[]', function() {
    return this.project.viewers;
  }),

  projectEditors: computed('project.users.[]', function() {
    return this.project.users.filter((u) => u.email !== this.currentUser.user.email);
  }),

  actions: {
    addUser() {
      this.set('error', null)

      this.get('store').query('user', { filter: { email: this.email } }).then((results) => {
        const user = results.firstObject;
        const projectEditors = this.project.users.mapBy('email');
        const projectViewers = this.project.viewers.mapBy('email');

        if (!user) {
          this.set('error', {message: "Could not find user"})
        } else if (projectEditors.includes(user.email) || projectViewers.includes(user.email)) {
          this.set('error', {message: "Cannot add the same user twice"})
        } else {
          if (this.access === 'editor') {
            this.project.users.pushObject(user)
          } else if (this.access === 'viewer') {
            this.project.viewers.pushObject(user)
          }
          
          this.project.save()
        }
      });
    },
    removeUser(user) {
      this.set('error', null)
      
      this.project.users.removeObject(user)
      this.project.save()
    },
    changeAccess(user, access) {
      this.set('error', null)

      if (access === 'editor') {
        this.project.viewers.removeObject(user)
        this.project.users.pushObject(user)

        this.project.save()
      } else if (access === 'viewer') {
        this.project.users.removeObject(user)
        this.project.viewers.pushObject(user)

        this.project.save()
      }
    }
  }
});
