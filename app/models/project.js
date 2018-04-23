import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  "ceqr-manual": service(),
  
  address: DS.attr('string'),
  bbls: DS.attr(),
  yearBuilt: DS.attr('number'),
  borough: DS.attr('string'),

  // Units
  totalUnits: DS.attr('number'),
  seniorUnits: DS.attr('number'),
  netUnits: computed('totalUnits', 'seniorUnits', function() {
    return this.get('totalUnits') - this.get('seniorUnits');
  }),

  // CEQR Manual
  minResidentialUnits: computed('borough', function() {
    return this.get("ceqr-manual").minResidentialUnitsFor(this.get('borough'));
  }),
  studentMultipliers: computed('borough', function() {
    return this.get('ceqr-manual').studentMultipliersFor(this.get('borough'));
  }),

  // Effects
  esEffect: computed('netUnits', 'borough', function() {
    return this.get('minResidentialUnits').es < this.get('netUnits');
  }),
  hsEffect: computed('netUnits', 'borough', function() {
    return this.get('minResidentialUnits').hs < this.get('netUnits');
  }),
  directEffect: DS.attr('boolean'),
  indirectEffect: computed('esEffect', 'hsEffect', function() {
    return (this.get('esEffect') || this.get('hsEffect'));
  }),

  // Estimated Students
  estEsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').es * this.get('netUnits'));
  }),
  estMsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').ms * this.get('netUnits'));
  }),
  estEsMsStudents: computed('estEsStudents', 'estMsStudents', function() {
    return this.get('estEsStudents') + this.get('estMsStudents');
  }),
  estHsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').hs * this.get('netUnits'));
  }),
});
