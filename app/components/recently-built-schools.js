import Component from '@ember/component';

export default Component.extend({
  actions: {
    saveProject: function() {
      this.get('project').save();
    },
  }
});
