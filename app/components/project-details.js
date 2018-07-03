import Component from '@ember/component';

export default Component.extend({
  actions: {
    next() {
      this.get('nextAction')();
    },

    directEffectTrue() {
      this.set('project.directEffect', true);
    },
    directEffectFalse() {
      this.set('project.directEffect', false);
    }
  }
});
