import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  setCeqrManual(manual) {
    this.set('ceqrManual', manual);
  },
  
  step: DS.attr('string', { defaultValue: 'new' }),

  project_id: DS.attr('string'),
  name: DS.attr('string'),
  bbls: DS.attr('', { defaultValue() { return []; } }),
  buildYear: DS.attr('number'),
  borough: DS.attr('string', { defaultValue: 'Bronx' }),

  // Units
  totalUnits: DS.attr('number', { defaultValue: 0 }),
  seniorUnits: DS.attr('number', { defaultValue: 0 }),
  netUnits: computed('totalUnits', 'seniorUnits', function() {
    return this.get('totalUnits') - this.get('seniorUnits');
  }),

  // CEQR Manual
  minResidentialUnits: computed('borough', function() {
    return this.get('ceqrManual').minResidentialUnitsFor(this.get('borough'));
  }),
  studentMultipliers: computed('borough', function() {
    return this.get('ceqrManual').studentMultipliersFor(this.get('borough'));
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


  // Analysis
  subdistricts: DS.attr('', { defaultValue() { return []; } }),
  subdistrictCartoIds: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('cartodb_id');
  }),
  subdistrictSqlPairs: computed('subdistricts', function() {
    return this.get('subdistricts').map(
      (f) => `(${f.district}, ${f.subdistrict})`
    );
  }),

  bluebook: DS.attr('', { defaultValue() { return []; } }),
  bluebookCartoIds: computed('bluebook', function() {
    return this.get('bluebook').mapBy('cartodb_id');
  }),

  lcgms: DS.attr('', { defaultValue() { return []; } }),
  lcgmsCartoIds: computed('lcgms', function() {
    return this.get('lcgms').mapBy('cartodb_id');
  }),

  scaProjects: DS.attr('', { defaultValue() { return []; } }),
  scaProjectsCartoIds: computed('scaProjects', function() {
    return this.get('scaProjects').mapBy('cartodb_id');
  }),
  
  // Tables
  existingConditions: DS.attr('existing-conditions', { defaultValue() { return []; } }),
  futureNoAction: DS.attr('', { defaultValue() { return []; } })
});
