import DS from 'ember-data';

export default DS.Model.extend({
  version: DS.attr('string'),
  thresholdPsIsStudents: DS.attr('number'),
  thresholdHsStudents: DS.attr('number'),

  // March 2014 attributes
  boroughs: DS.attr(),

  // November 2018 attributes
  districts: DS.attr()
});
