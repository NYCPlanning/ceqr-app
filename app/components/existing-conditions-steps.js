import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments)
    this.set('tab', 'schools');
  },

  actions: {
    setTab(tab) {
      this.set('tab', tab);
    }
  }
});
