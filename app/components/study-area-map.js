import Component from '@ember/component';

export default Component.extend({
  actions: {
    handleMapLoad(map) {
      window.map = map;
    },
  }
});
