import Component from '@ember/component';
import { task } from 'ember-concurrency';
import carto from 'carto-promises-utility/utils/carto';
import $ from 'jquery';

export default Component.extend({
  fetchBorough: task(function*() {
    let results = yield carto.SQL(`
      SELECT DISTINCT borough
      FROM mappluto_v1711
      WHERE bbl IN (${this.model.get('bbls').join(',')})
    `);

    let boroughMap = {
      'BX': 'Bronx',
      'BK': 'Brooklyn',
      'MN': 'Manhattan',
      'QN': 'Queens',
      'SI': 'Staten Island'
    };

    this.model.set('borough', boroughMap[results[0].borough]);
  }).restartable(),

  didInsertElement() {
    $('.ui.form').form({
      fields: {
        bbl: ['empty', 'exactLength[10]', 'integer'] 
      }
    });
  },
  
  actions: {
    addBbl(bbl) {
      this.model.get('bbls').pushObject(bbl);
      this.set('bbl', '');
      this.get('fetchBorough').perform();
    },
    removeBbl(bbl) {
      this.model.get('bbls').removeObject(bbl);
    },
  }
});
