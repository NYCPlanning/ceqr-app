import DS from 'ember-data';
import { computed } from '@ember/object';

import ExistingSchoolTotals from '../decorators/ExistingSchoolTotals';
import NoActionTotals from '../decorators/NoActionTotals';

export default DS.Model.extend({  
  setCeqrManual(manual) {
    this.set('ceqrManual', manual);
  },

  project_id: DS.attr('string'),
  name: DS.attr('string'),
  bbls: DS.attr('', { defaultValue() { return []; } }),
  buildYear: DS.attr('number'),
  buildYearCalculated: computed('buildYearCalculated', function() {
    return (parseInt(this.get('buildYear')) > 2025) ? 2025 : this.get('buildYear');
  }),
  
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
  estIsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').ms * this.get('netUnits'));
  }),
  estEsMsStudents: computed('estEsStudents', 'estIsStudents', function() {
    return this.get('estEsStudents') + this.get('estIsStudents');
  }),
  estHsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').hs * this.get('netUnits'));
  }),


  // Subdistricts
  subdistricts: DS.attr('', { defaultValue() { return []; } }),
  subdistrictCartoIds: computed('subdistricts', function() {
    return this.get('subdistricts').mapBy('cartodb_id');
  }),
  subdistrictSqlPairs: computed('subdistricts', function() {
    return this.get('subdistricts').map(
      (f) => `(${f.district}, ${f.subdistrict})`
    );
  }),

  // By Subdistrict
  bluebook: DS.attr('buildings', { defaultValue() { return []; } }),
  bluebookCartoIds: computed('bluebook', function() {
    return this.get('bluebook').mapBy('cartodb_id');
  }),

  lcgms: DS.attr('buildings', { defaultValue() { return []; } }),
  lcgmsCartoIds: computed('lcgms', function() {
    return this.get('lcgms').mapBy('cartodb_id');
  }),

  scaProjects: DS.attr('buildings', { defaultValue() { return []; } }),
  scaProjectsCartoIds: computed('scaProjects', function() {
    return this.get('scaProjects').mapBy('cartodb_id');
  }),

  buildings: computed('bluebook', 'lcgms', 'scaProjects', function() {
    return (
      this.get('bluebook')
    ).concat(
      this.get('lcgms')
    ).concat(
      this.get('scaProjects')
    ).compact();
  }),
  buildingsBldgIds: computed('buildings', function() {
    return this.get('buildings').mapBy('bldg_id').uniq();
  }),

  // Future
  doeUtilChanges: DS.attr('', { defaultValue() { return []; } }),

  futureResidentialDev: DS.attr('', { defaultValue() { return []; } }),

  futureEnrollmentProjections: DS.attr('', { defaultValue() { return []; } }),
  futureEnrollmentMultipliers: DS.attr('', { defaultValue() { return []; } }),
  futureEnrollmentNewHousing: DS.attr('', { defaultValue() { return []; } }),

  // Tables
  existingSchoolTotals: computed('subdistricts', 'lcgms', 'bluebook', function() {
    let tables = [];

    this.get('subdistricts').map((sd) => {
      tables.push(ExistingSchoolTotals.create({
        ...sd,
        level: 'ps',
        lcgms: this.get('lcgms').filter(
          (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'ps')
        ),
        bluebook: this.get('bluebook').filter(
          (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'ps')
        )
      }));

      tables.push(ExistingSchoolTotals.create({
        ...sd,
        level: 'is',
        lcgms: this.get('lcgms').filter(
          (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'is')
        ),
        bluebook: this.get('bluebook').filter(
          (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'is')
        )
      }));

      tables.push(ExistingSchoolTotals.create({
        ...sd,
        level: 'hs',
        lcgms: this.get('lcgms').filter(
          (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'hs')
        ),
        bluebook: this.get('bluebook').filter(
          (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'hs')
        )
      }));
    });

    return tables;
  }),

  noActionTotals: computed(
    'subdistricts',
    'futureEnrollmentProjections',
    'futureEnrollmentMultipliers',
    'futureEnrollmentNewHousing',
    'existingSchoolTotals.@each.capacityTotalNoAction',
    'scaProjects.@each.{includeInCapacity,ps_capacity,is_capacity,hs_capacity}',
    function() {
      let tables = [];
      
      this.get('subdistricts').map((sd) => {
        tables.push(NoActionTotals.create({
          ...sd,
          level: 'ps',
          
          enroll: Math.round(
            this.get('futureEnrollmentProjections').findBy('district', sd.district).ps
            *
            this.get('futureEnrollmentMultipliers').find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS')
            ).multiplier
          ),
          
          students: (
            // Students from future housing projected by SCA
            this.get('futureEnrollmentNewHousing').find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS')
            ).students
            +
            // Students from user-inputed additional developments 
            this.get('futureResidentialDev').filter(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict)
            ).reduce(function(acc, value) {
              return acc + value.ps_students;
            }, 0)
          ),
          
          capacityExisting: this.get('existingSchoolTotals').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'ps')
          ).reduce(function(acc, value) {
            return acc + value.get('capacityTotalNoAction');
          }, 0),

          scaCapacityIncrease: this.get('scaProjects').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true)
          ).reduce(function(acc, value) {
            let v = parseInt(value.get('ps_capacity'));
            if (v) return acc + v;
            else return 0;
          }, 0),

          studentsWithAction: this.get('estEsStudents') || 0,
        }));

        tables.push(NoActionTotals.create({
          ...sd,
          level: 'is',
          
          enroll: Math.round(
            this.get('futureEnrollmentProjections').findBy('district', sd.district).ms
            *
            this.get('futureEnrollmentMultipliers').find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS')
            ).multiplier
          ),
          
          students: (
            // Students from future housing projected by SCA
            this.get('futureEnrollmentNewHousing').find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS')
            ).students
            +
            // Students from user-inputed additional developments 
            this.get('futureResidentialDev').filter(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict)
            ).reduce(function(acc, value) {
              return acc + value.is_students;
            }, 0)
          ),
          
          capacityExisting: this.get('existingSchoolTotals').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'is')
          ).reduce(function(acc, value) {
            return acc + value.get('capacityTotalNoAction');
          }, 0),

          scaCapacityIncrease: this.get('scaProjects').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true)
          ).reduce(function(acc, value) {
            let v = parseInt(value.get('is_capacity'));
            if (v) return acc + v;
            else return 0;
          }, 0),

          studentsWithAction: this.get('estIsStudents') || 0,
        }));
      });

      return tables;
    }
  ),
});
