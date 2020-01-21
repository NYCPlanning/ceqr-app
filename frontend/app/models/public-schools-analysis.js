import Model, { belongsTo, attr } from '@ember-data/model';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

import turf from '@turf/helpers';
import SubdistrictTotals from '../fragments/public-schools/SubdistrictTotals';
import LevelTotals from '../fragments/public-schools/LevelTotals';


export default Model.extend({
  project: belongsTo('project'),
  dataPackage: belongsTo('data-package'),

  newDataAvailable: attr('boolean'),

  // Analysis Model triggers across
  detailedAnalysis: alias('indirectEffect'),

  // Aliases from project
  borough: alias('project.borough'),
  netUnits: alias('project.netUnits'),
  bbls: alias('project.bbls'),
  buildYear: alias('project.buildYear'),

  // Public Schools Multipliers
  multipliers: attr(''),
  multiplierVersion: alias('multipliers.version'),
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
  dataVersion: alias('dataPackage.version'),
  maxProjection: alias('dataPackage.schemas.sca_enrollment_projections_by_sd.maxYear'),
  minProjection: alias('dataPackage.schemas.sca_enrollment_projections_by_sd.minYear'),

  // Derived from map
  esSchoolChoice: attr('boolean'),
  isSchoolChoice: attr('boolean'),

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
  hsAnalysis: alias('hsEffect'),

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
  subdistrictsFromDb: attr('', { defaultValue() { return []; } }),
  subdistrictsFromUser: attr('', { defaultValue() { return []; } }),
  subdistrictsGeojson: attr(''),

  subdistricts: computed('subdistrictsFromDb.@each', 'subdistrictsFromUser.@each', function() {
    return this.subdistrictsFromDb.concat(this.subdistrictsFromUser);
  }),
  district: computed('subdistrictsFromDb', function() {
    return parseFloat(this.subdistrictsFromDb[0].district);
  }),
  multiSubdistrict: computed('subdistricts', function() {
    return this.subdistricts.length > 1;
  }),

  // By Subdistrict
  bluebook: attr('public-schools/schools', { defaultValue() { return []; } }),
  lcgms: attr('public-schools/schools', { defaultValue() { return []; } }),

  buildingsGeojson: computed('bluebook', 'lcgms', function() {
    const buildings = this.bluebook.concat(this.lcgms);

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

  scaProjects: attr('public-schools/sca-projects', { defaultValue() { return []; } }),
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

  buildings: computed('bluebook', 'lcgms', 'scaProjects', function() {
    return (
      this.bluebook
    ).concat(
      this.lcgms,
    ).concat(
      this.scaProjects,
    ).compact();
  }),
  buildingsBldgIds: computed('buildings', function() {
    return this.buildings.mapBy('bldg_id').uniq();
  }),

  // Future
  projectionOverMax: computed('buildYear', function() {
    return this.buildYear > this.maxProjection;
  }),
  buildYearMaxed: computed('projectionOverMax', function() {
    return this.projectionOverMax ? this.maxProjection : this.buildYear;
  }),

  doeUtilChanges: attr('', { defaultValue() { return []; } }),
  doeUtilChangesBldgIds: computed('doeUtilChanges.[]', function() {
    return this.doeUtilChanges.mapBy('bldg_id').concat(
      this.doeUtilChanges.mapBy('bldg_id_additional'),
    ).without('')
      .uniq();
  }),
  doeUtilChangesPerBldg: computed('doeUtilChanges', 'buildings', function() {
    const buildingsNoHs = this.buildings.filter((b) => (b.level !== 'hs'));

    return this.doeUtilChangesBldgIds.map((bldg_id) => {
      const buildings = buildingsNoHs.filterBy('bldg_id', bldg_id);

      if (buildings.length === 0) return;

      const doe_notices = this.doeUtilChanges.filter((b) => (
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

  residentialDevelopments: attr('public-schools/residential-developments',
    { defaultValue() { return []; } }),
  futureResidentialDev: computed('currentMultiplier', 'residentialDevelopments.[]', function() {
    return this.residentialDevelopments.map((d) => {
      d.set('multipliers', this.currentMultiplier);
      return d;
    });
  }),

  schoolsWithAction: attr('', { defaultValue() { return []; } }),

  hsProjections: attr('', { defaultValue() { return []; } }),
  hsStudentsFromHousing: attr('number', { defaultValue: 0 }),
  futureEnrollmentProjections: attr('', { defaultValue() { return []; } }),
  futureEnrollmentMultipliers: attr('', { defaultValue() { return []; } }),
  futureEnrollmentNewHousing: attr('', { defaultValue() { return []; } }),

  // Tables
  allSchools: computed('bluebook', 'lcgms', function() {
    return (
      this.bluebook
    ).concat(
      this.lcgms,
    ).compact();
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
            this.futureEnrollmentProjections.findBy('district', sd.district).ps
            * this.futureEnrollmentMultipliers.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'PS'),
            ).multiplier,
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
            this.futureEnrollmentProjections.findBy('district', sd.district).ms
            * this.futureEnrollmentMultipliers.find(
              (i) => (i.district === sd.district && i.subdistrict === sd.subdistrict && i.level === 'MS'),
            ).multiplier,
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
