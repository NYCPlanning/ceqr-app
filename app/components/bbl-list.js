import Component from '@ember/component';

export default Component.extend({
  actions: {
    addBbl(bbl) {
      this.model.get('bbls').pushObject(bbl);
      this.set('bbl', '');
    },
    removeBbl(bbl) {
      this.model.get('bbls').removeObject(bbl);
    },
  }
});
