import DS from 'ember-data';

export default DS.Model.extend({
  version: DS.attr('string'),
  enrollmentProjectionsMinYear: DS.attr('number'),
  enrollmentProjectionsMaxYear: DS.attr('number'),
  cartoTables: DS.attr(''),
});