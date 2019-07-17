import DS from 'ember-data';
import { computed } from '@ember/object';

import SubdistrictTotals from '../fragments/public-schools/SubdistrictTotals';
// import HighSchoolLevelTotals from '../fragments/public-schools/HighSchoolLevelTotals';
import LevelTotals from '../fragments/public-schools/LevelTotals';

export default DS.Model.extend({
  project: DS.belongsTo('project'),

  // Analysis Model triggers across
  detailedAnalysis: computed.alias('indirectEffect'),

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
  maxProjection: computed.alias('dataTables.enrollmentProjectionsMaxYear'),
  minProjection: computed.alias('dataTables.enrollmentProjectionsMinYear'),

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
  hsAnalysis: computed.alias('hsEffect'),

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

  subdistricts: computed('subdistrictsFromDb.@each', 'subdistrictsFromUser.@each', function() {
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
  bluebook: DS.attr('public-schools/schools', { defaultValue() { return []; } }),
  bluebook_findExisting(building, org_level) {
    return this.bluebook.filter(
      (e) =>
        e.org_id === building.org_id
        &&
        e.bldg_id === building.bldg_id
        &&
        e.level === org_level
        &&
        e.dataVersion === this.dataVersion
    )[0];
  },
  bluebookSqlPairs: computed('bluebook', function() {
    return this.bluebook.map(
      (f) => `('${f.org_id}', '${f.bldg_id}')`
    ).uniq();
  }),

  lcgms: DS.attr('public-schools/schools', { defaultValue() { return []; } }),
  lcgmsCartoIds: computed('lcgms', function() {
    return this.get('lcgms').mapBy('cartodb_id');
  }),

  scaProjects: DS.attr('', { defaultValue() { return []; } }),
  scaProjectsCartoIds: computed('scaProjects.@each', function() {
    return this.scaProjects.mapBy('cartodb_id');
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
    return this.doeUtilChangesPerBldg.length;
  }),

  residentialDevelopments: DS.attr('public-schools/residential-developments',
    { defaultValue() { return []; } }
  ),
  futureResidentialDev: computed('currentMultiplier', 'residentialDevelopments.[]', function() {
    return this.residentialDevelopments.map((d) => {
      d.set('multipliers', this.currentMultiplier);
      return d;
    });
  }),

  schoolsWithAction: DS.attr('', { defaultValue() { return []; } }),

  hsProjections: DS.attr('', { defaultValue() { return []; } }),
  hsStudentsFromHousing: DS.attr('number', { defaultValue: 0 }),
  futureEnrollmentProjections: DS.attr('', { defaultValue() { return []; } }),
  futureEnrollmentMultipliers: DS.attr('', { defaultValue() { return []; } }),
  futureEnrollmentNewHousing: DS.attr('', { defaultValue() { return []; } }),

  // Tables
  allSchools: computed('bluebook', 'lcgms', function() {
    return (
      this.bluebook
    ).concat(
      this.lcgms
    ).compact();
  }),

  // 365 Note: explain why this is defined in the model as opposed to HighSchoolLevelTotals
  scaCapacityIncreaseHighSchools: computed('scaProjects', function() {
  return this.scaProjects.filterBy('includeInCapacity', true)
    .reduce(function(acc, value) {
      let v = parseInt(value.hs_capacity);
      if (v) return acc + v;
      return acc;
    }, 0);
  }),

  subdistrictTotals: computed(
    'allSchools',
    'subdistricts',
    'currentMultiplier',
    'hsProjections',
    'futureEnrollmentProjections',
    'futureEnrollmentMultipliers',
    'futureEnrollmentNewHousing',
    'scaProjects.@each.{includeInCapacity,ps_capacity,is_capacity,hs_capacity}',
    function() {
      let tables = [];

      this.subdistricts.map((sd) => {
        tables.push(SubdistrictTotals.create({
          ...sd,
          level: 'ps',
          allBuildings: this.allSchools,

          studentMultiplier: this.currentMultiplier.ps,

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

          newCapacityWithAction: this.schoolsWithAction.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict)
          ).reduce(function(acc, value) {
            return acc + parseInt(value.ps_seats);
          }, 0),
        }));

        tables.push(SubdistrictTotals.create({
          ...sd,
          level: 'is',
          allBuildings: this.allSchools,

          studentMultiplier: this.currentMultiplier.is,

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

          newCapacityWithAction: this.schoolsWithAction.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict)
          ).reduce(function(acc, value) {
            return acc + parseInt(value.is_seats);
          }, 0),
        }));
      });

      return tables;
    },
  ),

  psLevelTotals: computed('{subdistrictTotals,schoolsWithAction}.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.subdistrictTotals.filterBy('level', 'ps'),
      studentsWithAction: this.estEsStudents || 0,
    });
  }),

  isLevelTotals: computed('{subdistrictTotals,schoolsWithAction}.@each', function() {
    return LevelTotals.create({
      subdistrictTotals: this.subdistrictTotals.filterBy('level', 'is'),
      studentsWithAction: this.estIsStudents || 0,
    });
  }),

  hsLevelTotals: computed('{subdistrictTotals,schoolsWithAction}.@each', function() {
    return HighSchoolLevelTotals.create({
      studentsWithAction: this.estHsStudents || 0,
    });
  }),
});
