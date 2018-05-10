import DS from 'ember-data';

export default DS.Model.extend({
  minResidentialUnits: DS.attr(),
  studentMultipliers: DS.attr(),

  thresholdEsMsStudents: DS.attr('number'),
  thresholdHsStudents: DS.attr('number'),

  minResidentialUnitsFor(boro) {
    return this.get('minResidentialUnits').findBy('name', boro);
  },

  studentMultipliersFor(boro) {
    return this.get('studentMultipliers').findBy('name', boro);
  }
});
