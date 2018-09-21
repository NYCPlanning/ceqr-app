import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),
  currentUser: service(),
  

  projectEditors: computed('project.users.[]', function() {
    return this.get('project.users').filter((u) => u.email !== this.get('currentUser.user.email'));
  }),

  actions: {
    addUser(email) {
      this.set('error', null)
      
      this.get('store').query('user', { filter: { email } }).then((results) => {
        const user = results.firstObject;
        const emailsOnProject = this.get('project.users').mapBy('email');

        if (!user) {
          this.set('error', {message: "Could not find user"})
        } else if (emailsOnProject.includes(user.email)) {
          this.set('error', {message: "Cannot add the same user twice"})
        } else {
          this.get('project.users').pushObject(user)
          this.get('project').save()
        }
      });
    },
    removeUser(user) {
      this.set('error', null)
      
      this.get('project.users').removeObject(user)
      this.get('project').save()
    }
  }
});
