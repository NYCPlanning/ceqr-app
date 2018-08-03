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
