import Component from '@ember/component';

export default Component.extend({
  actions: {
    save: function() {
      this.set('saving', true);
      this.get('project').save().then(() => this.set('saving', false));
    },
  }
});
