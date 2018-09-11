import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import SchoolTotals from '../decorators/SchoolTotals';
import AggregateTotals from '../decorators/AggregateTotals';

export default DS.Model.extend({  
  session: service(),

  didUpdate() {
    this.set('last_updated', Date.now());
    this.set('last_updated_by', this.get('session.currentUser.email'));
  },

  didCreate() {
    this.set('last_updated', Date.now());
    this.set('last_updated_by', this.get('session.currentUser.email'));
  },
  
  setCeqrManual(manual) {
    this.set('ceqrManual', manual);
  },

  ceqr_number: DS.attr('string'),
  name: DS.attr('string'),
  bbls: DS.attr('', { defaultValue() { return []; } }),
  user: DS.attr('string'),
  buildYear: DS.attr('number'),

  last_updated: DS.attr('number'),
  last_updated_by: DS.attr('string'),
  
  borough: DS.attr('string', { defaultValue: 'Bronx' }),
  boroCode: computed('borough', function() {
    switch (this.get('borough')) {
      case 'Manhattan': return 1;
      case 'Bronx': return 2;
      case 'Brooklyn': return 3;
      case 'Queens': return 4;
      case 'Staten Island': return 5;
      default: return null;
    }
  }),

  // - Tranpsortation -
  trafficZone: DS.attr('number'),

  // - Schools Capacity -
  hsAnalysis: computed.alias('hsEffect'),

  esSchoolChoice: DS.attr('boolean'),
  isSchoolChoice: DS.attr('boolean'),

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
    return this.get('minResidentialUnits').ps < this.get('netUnits');
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
    return Math.ceil(this.get('studentMultipliers').ps * this.get('netUnits'));
  }),
  estIsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').is * this.get('netUnits'));
  }),
  estEsMsStudents: computed('estEsStudents', 'estIsStudents', function() {
    return this.get('estEsStudents') + this.get('estIsStudents');
  }),
  estHsStudents: computed('netUnits', 'borough', function() {
    return Math.ceil(this.get('studentMultipliers').hs * this.get('netUnits'));
  }),


  // Subdistricts
  subdistrictsFromDB: DS.attr('', { defaultValue() { return []; } }),
  subdistrictsFromUser: DS.attr('', { defaultValue() { return []; } }),
  
  subdistricts: computed('subdistrictsFromDB', function() {
    return this.get('subdistrictsFromDB').concat(this.get('subdistrictsFromUser'));
  }),

  multiSubdistrict: computed('subdistricts', function() {
    return (this.get('subdistricts').length > 1)
  }),
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
  maxProjection: 2025,
  minProjection: 2018,
  projectionOverMax: computed('buildYear', function() {
    return this.get('buildYear') > this.get('maxProjection')
  }),
  buildYearMaxed: computed('projectionOverMax', function() {
    return this.get('projectionOverMax') ? this.get('maxProjection') : this.get('buildYear');
  }),

  doeUtilChanges: DS.attr('', { defaultValue() { return []; } }),
  doeUtilChangesBldgIds: computed('doeUtilChanges.[]', function() {
    return this.get('doeUtilChanges').mapBy('bldg_id').concat(
      this.get('doeUtilChanges').mapBy('bldg_id_additional')
    ).without('').uniq();
  }),
  doeUtilChangesPerBldg: computed('doeUtilChanges', 'buildings', function() {    
    const buildingsNoHs = this.get('buildings').filter(b => (b.level !== 'hs'));
    
    return this.get('doeUtilChangesBldgIds').map(bldg_id => {      
      const buildings = buildingsNoHs.filterBy('bldg_id', bldg_id);

      if (buildings.length === 0) return;
      
      return ({
        bldg_id,
        buildings,
        doe_notices: this.get('doeUtilChanges').filter(b => (
          b.bldg_id === bldg_id || b.bldg_id_additional === bldg_id
        ))
      })
    }).compact();
  }),
  doeUtilChangesCount: computed('doeUtilChanges', function() {
    return this.get('doeUtilChangesPerBldg').length;
  }),

  futureResidentialDev: DS.attr('', { defaultValue() { return []; } }),
  schoolsWithAction: DS.attr('', { defaultValue() { return []; } }),

  hsProjections: DS.attr('', { defaultValue() { return []; } }),
  hsStudentsFromHousing: DS.attr('number', { defaultValue: 0 }),
  futureEnrollmentProjections: DS.attr('', { defaultValue() { return []; } }),
  futureEnrollmentMultipliers: DS.attr('', { defaultValue() { return []; } }),
  futureEnrollmentNewHousing: DS.attr('', { defaultValue() { return []; } }),

  // Tables
  schoolTotals: computed('subdistricts', 'lcgms', 'bluebook', function() {
    let tables = [];

    this.get('subdistricts').map((sd) => {
      tables.push(SchoolTotals.create({
        ...sd,
        level: 'ps',
        allBuildings: (
            this.get('bluebook')
          ).concat(
            this.get('lcgms')
          ).compact(),
      }));

      tables.push(SchoolTotals.create({
        ...sd,
        level: 'is',
        allBuildings: (
          this.get('bluebook')
        ).concat(
          this.get('lcgms')
        ).compact(),
      }));
    });

    tables.push(SchoolTotals.create({
      level: 'hs',
      allBuildings: (
        this.get('bluebook')
      ).concat(
        this.get('lcgms')
      ).compact(),
    }));

    return tables;
  }),

  aggregateTotals: computed(
    'subdistricts',
    'hsProjections',
    'futureEnrollmentProjections',
    'futureEnrollmentMultipliers',
    'futureEnrollmentNewHousing',
    'schoolTotals.@each.capacityTotalNoAction',
    'scaProjects.@each.{includeInCapacity,ps_capacity,is_capacity,hs_capacity}',
    function() {
      let tables = [];

      tables.push(AggregateTotals.create({
        borough: this.get('borough'),
        studentMultiplier: this.get('ceqrManual').studentMultipliersFor(this.get('borough')).hs,
        level: 'hs',

        enroll: this.get('hsProjections')[0] ? this.get('hsProjections')[0].hs : 0,
        enrollExistingConditions: this.get('schoolTotals').findBy('level', 'hs').get('enrollmentTotal'),
        students: (
          this.get('hsStudentsFromHousing')
          +
          this.get('futureResidentialDev').reduce(function(acc, value) {
            return acc + value.hs_students;
          }, 0)
        ),

        capacityExisting: this.get('schoolTotals').findBy('level', 'hs').get('capacityTotalNoAction'),
        scaCapacityIncrease: this.get('scaProjects')
          .filterBy('includeInCapacity', true)
          .reduce(function(acc, value) {
            let v = parseInt(value.get('hs_capacity'));
            if (v) return acc + v;
            return acc;
          }, 0),

        studentsWithAction: this.get('estHsStudents') || 0,
      }));

      this.get('subdistricts').map((sd) => {
        tables.push(AggregateTotals.create({
          ...sd,
          level: 'ps',
          studentMultiplier: this.get('ceqrManual').studentMultipliersFor(this.get('borough')).ps,

          enroll: Math.round(
            this.get('futureEnrollmentProjections').findBy('district', sd.district).ps
            *
            this.get('futureEnrollmentMultipliers').find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS')
            ).multiplier
          ),
          enrollExistingConditions: this.get('schoolTotals').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'ps')
          )[0].get('enrollmentTotal'),
          
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
          
          capacityExisting: this.get('schoolTotals').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'ps')
          ).reduce(function(acc, value) {            
            return acc + parseInt(value.get('capacityTotalNoAction'));
          }, 0),

          scaCapacityIncrease: this.get('scaProjects').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true)
          ).reduce(function(acc, value) {
            let v = parseInt(value.get('ps_capacity'));
            if (v) return acc + v;
            return acc;
          }, 0),

          studentsWithAction: this.get('estEsStudents') || 0,
        }));

        tables.push(AggregateTotals.create({
          ...sd,
          level: 'is',
          studentMultiplier: this.get('ceqrManual').studentMultipliersFor(this.get('borough')).is,
          
          enroll: Math.round(
            this.get('futureEnrollmentProjections').findBy('district', sd.district).ms
            *
            this.get('futureEnrollmentMultipliers').find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS')
            ).multiplier
          ),
          enrollExistingConditions: this.get('schoolTotals').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'is')
          )[0].get('enrollmentTotal'),
          
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
          
          capacityExisting: this.get('schoolTotals').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'is')
          ).reduce(function(acc, value) {            
            return acc + parseInt(value.get('capacityTotalNoAction'));
          }, 0),

          scaCapacityIncrease: this.get('scaProjects').filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true)
          ).reduce(function(acc, value) {
            let v = parseInt(value.get('is_capacity'));
            if (v) return acc + v;
            return acc;
          }, 0),

          studentsWithAction: this.get('estIsStudents') || 0,
        }));
      });

      return tables;
    }
  ),
});
