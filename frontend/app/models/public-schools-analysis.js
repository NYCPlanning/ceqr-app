import DS from 'ember-data';
import { computed } from '@ember/object';

import turf from '@turf/helpers';
import SubdistrictTotals from '../fragments/public-schools/SubdistrictTotals';
import LevelTotals from '../fragments/public-schools/LevelTotals';


export default DS.Model.extend({
  project: DS.belongsTo('project'),
  dataPackage: DS.belongsTo('data-package'),

  newDataAvailable: DS.attr('boolean'),

  // Analysis Model triggers across
  detailedAnalysis: computed.alias('indirectEffect'),

  // Aliases from project
  borough: computed.alias('project.borough'),
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
        return this.multipliers.districts.findBy('csd', parseFloat(this.district)) || {};
      default:
        return {};
    }
  }),

  // Schools Data version
  dataVersion: computed.alias('dataPackage.version'),
  maxProjection: computed.alias('dataPackage.schemas.sca_enrollment_projections_by_sd.maxYear'),
  minProjection: computed.alias('dataPackage.schemas.sca_enrollment_projections_by_sd.minYear'),

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
  subdistrictsGeojson: DS.belongsTo('subdistricts-geojson'),

  subdistricts: computed('subdistrictsFromDb.@each', 'subdistrictsFromUser.@each', function() {
    return this.subdistrictsFromDb.concat(this.subdistrictsFromUser);
  }),
  district: computed('subdistrictsFromDb', function() {
    return parseFloat(this.subdistrictsFromDb[0].district);
  }),
  multiSubdistrict: computed('subdistricts', function() {
    return (this.get('subdistricts').length > 1);
  }),

  // By Subdistrict
  ceqr_school_buildings: DS.attr('public-schools/schools', { defaultValue() { return []; } }),

  buildingsGeojson: computed('ceqr_school_buildings', function() {
    const buildings = this.ceqr_schools_buildings;

    const features = buildings.map((b) => {
      const { geojson } = b;

      geojson.properties = {
        level: b.level,
        name: b.name,
        org_id: b.org_id,
        bldg_id: b.bldg_id,
        source: b.source,
        id: b.id,
      };

      return geojson;
    });

    return turf.featureCollection(features);
  }),

  scaProjects: DS.attr('public-schools/sca-projects', { defaultValue() { return []; } }),
  scaProjectsGeojson: computed('scaProjects', function() {
    const features = this.scaProjects.map((b) => {
      const { geojson } = b;

      geojson.properties = {
        name: b.name,
        org_id: b.org_id,
        source: b.source,
        org_level: b.org_level,
        level: b.org_level,
        id: b.id,
      };

      return geojson;
    });

    return turf.featureCollection(features);
  }),

  buildings: computed('ceqr_school_buildings', 'scaProjects', function() {
    return (
      this.get('ceqr_school_buildings')
    ).concat(
      this.get('scaProjects'),
    ).compact();
  }),
  buildingsBldgIds: computed('buildings', function() {
    return this.get('buildings').mapBy('bldg_id').uniq();
  }),

  // ceqr_school_buildings dataset is a combination of two datasets lcgms and bluebook
  // lcgms dataset represents schools that opened recently
  newlyOpenedSchools: computed('analysis.ceqr_school_buildings', function() {
    return this.ceqr_school_buildings.find((school) => school.source === 'lcgms');
  }),

  // Future
  projectionOverMax: computed('buildYear', function() {
    return this.get('buildYear') > this.get('maxProjection');
  }),
  buildYearMaxed: computed('projectionOverMax', function() {
    return this.get('projectionOverMax') ? this.get('maxProjection') : this.get('buildYear');
  }),

  doeUtilChanges: DS.attr('', { defaultValue() { return []; } }),
  doeUtilChangesBldgIds: computed('doeUtilChanges.[]', function() {
    return this.get('doeUtilChanges').mapBy('bldg_id').concat(
      this.get('doeUtilChanges').mapBy('bldg_id_additional'),
    ).without('')
      .uniq();
  }),
  doeUtilChangesPerBldg: computed('doeUtilChanges', 'buildings', function() {
    const buildingsNoHs = this.get('buildings').filter((b) => (b.level !== 'hs'));

    return this.get('doeUtilChangesBldgIds').map((bldg_id) => {
      const buildings = buildingsNoHs.filterBy('bldg_id', bldg_id);

      if (buildings.length === 0) return;

      const doe_notices = this.get('doeUtilChanges').filter((b) => (
        b.bldg_id === bldg_id || b.bldg_id_additional === bldg_id
      )).mapBy('title').uniq()
        .map((title) => (
          this.doeUtilChanges.filterBy('title', title)
        ));

      return ({
        bldg_id,
        buildings,
        doe_notices,
      });
    }).compact();
  }),
  doeUtilChangesCount: computed('doeUtilChanges', function() {
    return this.doeUtilChangesPerBldg.length;
  }),

  residentialDevelopments: DS.attr('public-schools/residential-developments',
    { defaultValue() { return []; } }),
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
  futureEnrollmentNewHousing: DS.attr('', { defaultValue() { return []; } }),

  // Tables
  allSchools: computed('ceqr_school_buildings', function() {
    return (
      this.ceqr_school_buildings
    ).compact();
  }),

  subdistrictTotals: computed(
    'allSchools',
    'subdistricts',
    'currentMultiplier',
    'hsProjections',
    'futureEnrollmentProjections',
    'futureEnrollmentNewHousing',
    'scaProjects.@each.{includeInCapacity,ps_capacity,is_capacity,hs_capacity}',
    function() {
      const tables = [];

      tables.push(SubdistrictTotals.create({
        borough: this.borough,
        level: 'hs',
        allBuildings: this.allSchools,

        studentMultiplier: this.currentMultiplier.hs,

        enroll: this.hsProjections[0] ? this.hsProjections[0].hs : 0,

        students: (
          this.hsStudentsFromHousing
          + this.futureResidentialDev.reduce(function(acc, value) {
            return acc + value.hs_students;
          }, 0)
        ),

        scaCapacityIncrease: this.scaProjects
          .filterBy('includeInCapacity', true)
          .reduce(function(acc, value) {
            const v = parseFloat(value.hs_capacity);
            if (v) return acc + v;
            return acc;
          }, 0),

        newCapacityWithAction: this.schoolsWithAction.reduce(function(acc, value) {
          return acc + parseFloat(value.hs_seats);
        }, 0),
      }));

      this.subdistricts.map((sd) => {
        tables.push(SubdistrictTotals.create({
          ...sd,
          level: 'ps',
          allBuildings: this.allSchools,

          studentMultiplier: this.currentMultiplier.ps,

          enroll: Math.round(
            this.futureEnrollmentProjections.findBy('district', sd.district).ps,
          ),

          students: (
            // Students from future housing projected by SCA
            this.futureEnrollmentNewHousing.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS'),
            ).students
            +
            // Students from user-inputed additional developments
            this.futureResidentialDev.filter(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict),
            ).reduce(function(acc, value) {
              return acc + value.ps_students;
            }, 0)
          ),

          scaCapacityIncrease: this.scaProjects.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true),
          ).reduce(function(acc, value) {
            const v = parseFloat(value.ps_capacity);
            if (v) return acc + v;
            return acc;
          }, 0),

          newCapacityWithAction: this.schoolsWithAction.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict),
          ).reduce(function(acc, value) {
            return acc + parseFloat(value.ps_seats);
          }, 0),
        }));

        tables.push(SubdistrictTotals.create({
          ...sd,
          level: 'is',
          allBuildings: this.allSchools,

          studentMultiplier: this.currentMultiplier.is,

          enroll: Math.round(
            this.futureEnrollmentProjections.findBy('district', sd.district).ms,
          ),

          students: (
            // Students from future housing projected by SCA
            this.futureEnrollmentNewHousing.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS'),
            ).students
            +
            // Students from user-inputed additional developments
            this.futureResidentialDev.filter(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict),
            ).reduce(function(acc, value) {
              return acc + value.is_students;
            }, 0)
          ),

          scaCapacityIncrease: this.scaProjects.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict && b.includeInCapacity === true),
          ).reduce(function(acc, value) {
            const v = parseFloat(value.is_capacity);
            if (v) return acc + v;
            return acc;
          }, 0),

          newCapacityWithAction: this.schoolsWithAction.filter(
            (b) => (b.district === sd.district && b.subdistrict === sd.subdistrict),
          ).reduce(function(acc, value) {
            return acc + parseFloat(value.is_seats);
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
    return LevelTotals.create({
      subdistrictTotals: this.subdistrictTotals.filterBy('level', 'hs'),
      studentsWithAction: this.estHsStudents || 0,
    });
  }),
});
