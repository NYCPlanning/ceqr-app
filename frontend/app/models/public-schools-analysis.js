import DS from 'ember-data';
import { computed } from '@ember/object';

import SchoolTotals from '../decorators/SchoolTotals';
import AggregateTotals from '../decorators/AggregateTotals';

export default DS.Model.extend({  
  project: DS.belongsTo('project'),

  // Aliases from project
  borough: computed.alias('project.borough'),
  boroCode: computed.alias('project.boroCode'),
  netUnits: computed.alias('project.netUnits'),
  bbls: computed.alias('project.bbls'),
  buildYear: computed.alias('project.buildYear'),

  // Public Schools Multipliers
  multipliers: DS.attr(''),
  multiplierVersion: computed.alias('multipliers.version'),
  currentMultiplier: computed('multipliers', 'borough', function() {        
    switch (this.multipliers.version) {
      case 'march-2014':
        return this.multipliers.boroughs.findBy('name', this.borough) || {};
      case 'november-2018':
        return this.multipliers.districts.findBy('csd', this.district) || {};
      default:
        return {};
    }
  }),

  // Schools Data version
  dataTables: DS.attr(''),
  dataVersion: computed.alias('dataTables.version'),

  hsAnalysis: computed.alias('hsEffect'),

  // Derived from map
  esSchoolChoice: DS.attr('boolean'),
  isSchoolChoice: DS.attr('boolean'),
  
  // Effects
  esEffect: computed('multipliers', 'estEsMsStudents', function() {
    return this.multipliers.thresholdPsIsStudents < this.estEsMsStudents;
  }),
  hsEffect: computed('multipliers', 'estHsStudents', function() {
    return this.multipliers.thresholdHsStudents < this.estHsStudents;
  }),
  indirectEffect: computed('esEffect', 'hsEffect', function() {
    return (this.esEffect || this.hsEffect);
  }),

  // Estimated Students
  estEsStudents: computed('netUnits', 'borough', 'currentMultiplier', function() {
    return Math.ceil(this.currentMultiplier.ps * this.netUnits);
  }),
  estIsStudents: computed('netUnits', 'borough', 'currentMultiplier', function() {
    return Math.ceil(this.currentMultiplier.is * this.netUnits);
  }),
  estEsMsStudents: computed('estEsStudents', 'estIsStudents', function() {
    return this.estEsStudents + this.estIsStudents;
  }),
  estHsStudents: computed('netUnits', 'borough', 'currentMultiplier', function() {
    return Math.ceil(this.currentMultiplier.hs * this.netUnits);
  }),

  // School District & Subdistricts
  subdistrictsFromDb: DS.attr('', { defaultValue() { return []; } }),
  subdistrictsFromUser: DS.attr('', { defaultValue() { return []; } }),
  
  subdistricts: computed('subdistrictsFromDb', 'subdistrictsFromUser', function() {
    return this.subdistrictsFromDb.concat(this.subdistrictsFromUser);
  }),
  district: computed('subdistrictsFromDb', function() {
    return this.subdistrictsFromDb[0].district;
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
  bluebookSqlPairs: computed('bluebook', function() {
    return this.bluebook.map(
      (f) => `('${f.org_id}', '${f.bldg_id}')`
    ).uniq();
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
    'currentMultiplier',
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

        studentMultiplier: this.currentMultiplier.hs,
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
          studentMultiplier: this.currentMultiplier.ps,
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
          studentMultiplier: this.currentMultiplier.is,
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
