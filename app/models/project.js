import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import SchoolTotals from '../decorators/SchoolTotals';
import AggregateTotals from '../decorators/AggregateTotals';

export default DS.Model.extend({    
  currentUser: service(),
  
  setCeqrManual(manual) {
    this.set('ceqrManual', manual);
  },

  // user: DS.attr('string'),
  users: DS.hasMany('user', { inverse: 'projects' }),
  viewers: DS.hasMany('user', { inverse: 'projects_viewable' }),

  viewOnly: computed('viewers.[]', function() {    
    return this.viewers.mapBy('id').includes(this.currentUser.user.id);
  }),

  created_at: DS.attr('number'),
  updated_at: DS.attr('number'),
  updated_by: DS.attr('string'),

  name: DS.attr('string'),
  buildYear: DS.attr('number'),
  bbls: DS.attr('', { defaultValue() { return []; } }),
  ceqrNumber: DS.attr('string'),
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

  // TODO: split out into other relationships

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
  subdistrictsFromDb: DS.attr('', { defaultValue() { return []; } }),
  subdistrictsFromUser: DS.attr('', { defaultValue() { return []; } }),
  
  subdistricts: computed('subdistrictsFromDb', function() {
    return this.get('subdistrictsFromDb').concat(this.get('subdistrictsFromUser'));
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
      
      const doe_notices = this.get('doeUtilChanges').filter(b => (
        b.bldg_id === bldg_id || b.bldg_id_additional === bldg_id
      )).mapBy('title').uniq().map((title) => (
        this.doeUtilChanges.filterBy('title', title)
      ));

      return ({
        bldg_id,
        buildings,
        doe_notices
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

    this.subdistricts.map((sd) => {
      tables.push(SchoolTotals.create({
        ...sd,
        level: 'ps',
        allBuildings: (
            this.bluebook
          ).concat(
            this.lcgms
          ).compact(),
      }));

      tables.push(SchoolTotals.create({
        ...sd,
        level: 'is',
        allBuildings: (
          this.bluebook
        ).concat(
          this.lcgms
        ).compact(),
      }));
    });

    tables.push(SchoolTotals.create({
      level: 'hs',
      allBuildings: (
        this.bluebook
      ).concat(
        this.lcgms
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
        borough: this.borough,
        level: 'hs',

        studentMultiplier: this.ceqrManual.studentMultipliersFor(this.borough).hs,
        schoolTotals: this.schoolTotals.findBy('level', 'hs'),

        enroll: this.hsProjections[0] ? this.hsProjections[0].hs : 0,
        
        students: (
          this.hsStudentsFromHousing
          +
          this.futureResidentialDev.reduce(function(acc, value) {
            return acc + value.hs_students;
          }, 0)
        ),

        scaCapacityIncrease: this.scaProjects
          .filterBy('includeInCapacity', true)
          .reduce(function(acc, value) {
            let v = parseInt(value.hs_capacity);
            if (v) return acc + v;
            return acc;
          }, 0),

        studentsWithAction: this.estHsStudents || 0,
        newCapacityWithAction: this.schoolsWithAction.reduce(function(acc, value) {
          return acc + parseInt(value.hs_seats);
        }, 0),
      }));

      this.subdistricts.map((sd) => {
        tables.push(AggregateTotals.create({
          ...sd,
          level: 'ps',
          studentMultiplier: this.ceqrManual.studentMultipliersFor(this.borough).ps,
          schoolTotals: this.schoolTotals.find(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'ps')
          ),

          enroll: Math.round(
            this.futureEnrollmentProjections.findBy('district', sd.district).ps
            *
            this.futureEnrollmentMultipliers.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS')
            ).multiplier
          ),
          
          students: (
            // Students from future housing projected by SCA
            this.futureEnrollmentNewHousing.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS')
            ).students
            +
            // Students from user-inputed additional developments 
            this.futureResidentialDev.filter(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict)
            ).reduce(function(acc, value) {
              return acc + value.ps_students;
            }, 0)
          ),
          
          scaCapacityIncrease: this.scaProjects.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true)
          ).reduce(function(acc, value) {
            let v = parseInt(value.ps_capacity);
            if (v) return acc + v;
            return acc;
          }, 0),

          studentsWithAction: this.estEsStudents || 0,
          newCapacityWithAction: this.schoolsWithAction.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict)
          ).reduce(function(acc, value) {
            return acc + parseInt(value.ps_seats);
          }, 0),
        }));

        tables.push(AggregateTotals.create({
          ...sd,
          level: 'is',
          studentMultiplier: this.ceqrManual.studentMultipliersFor(this.borough).is,
          schoolTotals: this.schoolTotals.find(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.level === 'is')
          ),

          enroll: Math.round(
            this.futureEnrollmentProjections.findBy('district', sd.district).ms
            *
            this.futureEnrollmentMultipliers.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS')
            ).multiplier
          ),

          students: (
            // Students from future housing projected by SCA
            this.futureEnrollmentNewHousing.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS')
            ).students
            +
            // Students from user-inputed additional developments 
            this.futureResidentialDev.filter(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict)
            ).reduce(function(acc, value) {
              return acc + value.is_students;
            }, 0)
          ),
          
          scaCapacityIncrease: this.scaProjects.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true)
          ).reduce(function(acc, value) {
            let v = parseInt(value.is_capacity);
            if (v) return acc + v;
            return acc;
          }, 0),

          studentsWithAction: this.estIsStudents || 0,
          newCapacityWithAction: this.schoolsWithAction.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict)
          ).reduce(function(acc, value) {
            return acc + parseInt(value.is_seats);
          }, 0),
        }));
      });

      return tables;
    }
  ),
});
