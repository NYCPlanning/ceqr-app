import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.resdev = {};
  },
  
  actions: {
    addResDev(resdev) {
      this.get('project.futureResidentialDev').pushObject(resdev);
      this.get('project').save();
      this.set('resdev', {});
    },
    removeResDev(resdev) {
      this.get('project.futureResidentialDev').removeObject(resdev);
      this.get('project').save();
    },
  }
});
