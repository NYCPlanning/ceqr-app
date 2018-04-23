import DS from 'ember-data';

export default DS.Model.extend({
  minResidentialUnits: DS.attr(),
  studentMultipliers: DS.attr(),

  thresholdEsMsStudents: DS.attr('number'),
  thresholdHsStudents: DS.attr('number')
});
