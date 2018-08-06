import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  buildYearRange: Array.from({length: (2040 - 2018)}, (v, k) => k + 2018),
  
  didInsertElement() {
    $('.ui.form').form({
      fields: {
        name: 'empty',
        bbl: ['empty', 'exactLength[10]', 'integer'] 
      }
    });
  },

  actions: {
    save() {
      this.get('save')(this.get('project'));
    },
    rollback() {
      this.get('rollback')(this.get('project'));
    },

    directEffectTrue() {
      this.set('project.directEffect', true);
    },
    directEffectFalse() {
      this.set('project.directEffect', false);
    }
  }
});
