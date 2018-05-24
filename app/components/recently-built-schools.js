import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  buildings: computed('project.lcgms.@each', function() {
    return (
      this.get('project.lcgms.ps')
    ).concat(
      this.get('project.lcgms.is')
    ).concat(
      this.get('project.lcgms.hs')
    ).compact();
  }),

  actions: {
    saveProject: function() {
      this.get('project').save();
    },
  }
});
