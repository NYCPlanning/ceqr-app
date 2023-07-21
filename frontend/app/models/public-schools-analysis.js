import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias, or, gt, reads } from '@ember/object/computed';

import turf from '@turf/helpers';
import SubdistrictTotals from '../fragments/public-schools/SubdistrictTotals';
import LevelTotals from '../fragments/public-schools/LevelTotals';

export default class PublicSchoolsAnalysisModel extends Model {
  @belongsTo('project') project;
  @belongsTo('data-package') dataPackage;

  @attr('boolean') newDataAvailable;

  // Analysis Model triggers across
  @alias('indirectEffect') detailedAnalysis;

  // Aliases from project
  @alias('project.borough') borough;
  @alias('project.netUnits') netUnits;
  @alias('project.bbls') bbls;
  @alias('project.buildYear') buildYear;

  // Public Schools Multipliers
  @attr('') multipliers;
  @alias('multipliers.version') multiplierVersion;
  @computed(
    'borough',
    'district',
    'multipliers.{boroughs,districts,version}',
    function () {
      switch (this.multipliers.version) {
        case 'march-2014':
          return this.multipliers.boroughs.findBy('name', this.borough) || {};
        case 'november-2018':
        case 'november-2019':
          return (
            this.multipliers.districts.findBy(
              'csd',
              parseFloat(this.district)
            ) || {}
          );
        default:
          return {};
      }
    }
  )
  currentMultiplier;

  // Schools Data version
  @alias('dataPackage.version') dataVersion;
  @alias('dataPackage.schemas.sca_e_projections_by_sd.maxYear') maxProjection;
  @alias('dataPackage.schemas.sca_e_projections_by_sd.minYear') minProjection;

  // Derived from map
  @attr('boolean') esSchoolChoice;
  @attr('boolean') isSchoolChoice;

  // Effects
  @computed(
    'estEsMsStudents',
    'multipliers.thresholdPsIsStudents',
    function () {
      return this.multipliers.thresholdPsIsStudents < this.estEsMsStudents;
    }
  )
  esEffect;
  @computed('estHsStudents', 'multipliers.thresholdHsStudents', function () {
    return this.multipliers.thresholdHsStudents < this.estHsStudents;
  })
  hsEffect;
  @or('esEffect', 'hsEffect') indirectEffect;
  @alias('hsEffect') hsAnalysis;

  // Estimated Students
  @computed('borough', 'currentMultiplier.ps', 'netUnits', function () {
    return Math.ceil(this.currentMultiplier.ps * this.netUnits);
  })
  estEsStudents;
  @computed('borough', 'currentMultiplier.is', 'netUnits', function () {
    return Math.ceil(this.currentMultiplier.is * this.netUnits);
  })
  estIsStudents;
  @computed('estEsStudents', 'estIsStudents', function () {
    return this.estEsStudents + this.estIsStudents;
  })
  estEsMsStudents;
  @computed('borough', 'currentMultiplier.hs', 'netUnits', function () {
    return Math.ceil(this.currentMultiplier.hs * this.netUnits);
  })
  estHsStudents;

  // School District & Subdistricts
  @attr('', {
    defaultValue() {
      return [];
    },
  })
  subdistrictsFromDb;
  @attr('', {
    defaultValue() {
      return [];
    },
  })
  subdistrictsFromUser;
  @belongsTo('subdistricts-geojson') subdistrictsGeojson;

  @computed('subdistrictsFromDb.[]', 'subdistrictsFromUser.[]', function () {
    return this.subdistrictsFromDb.concat(this.subdistrictsFromUser);
  })
  subdistricts;
  @computed('subdistrictsFromDb', function () {
    return parseFloat(this.subdistrictsFromDb[0].district);
  })
  district;
  @gt('subdistricts.length', 1) multiSubdistrict;

  // By Subdistrict
  @attr('public-schools/schools', {
    defaultValue() {
      return [];
    },
  })
  school_buildings;

  @computed('school_buildings', function () {
    const buildings = this.school_buildings;

    const features = buildings.map((building) => {
      const { geojson } = building;

      geojson.properties = {
        level: building.level,
        name: building.name,
        org_id: building.org_id,
        bldg_id: building.bldg_id,
        source: building.source,
        id: building.id,
      };

      return geojson;
    });

    return turf.featureCollection(features);
  })
  buildingsGeojson;

  @attr('public-schools/sca-projects', {
    defaultValue() {
      return [];
    },
  })
  scaProjects;
  @computed('scaProjects', function () {
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
  })
  scaProjectsGeojson;

  @computed('school_buildings', 'scaProjects', function () {
    return this.school_buildings.concat(this.scaProjects).compact();
  })
  buildings;
  @computed('buildings', function () {
    return this.buildings.mapBy('bldg_id').uniq();
  })
  buildingsBldgIds;

  // ceqr_school_buildings dataset is a combination of two datasets lcgms and bluebook
  // lcgms dataset represents schools that opened recently
  @computed('analysis.school_buildings', 'school_buildings', function () {
    return this.school_buildings.find((school) => school.source === 'lcgms');
  })
  newlyOpenedSchools;

  // Future
  @computed('buildYear', 'maxProjection', function () {
    return this.buildYear > this.maxProjection;
  })
  projectionOverMax;
  @computed('buildYear', 'maxProjection', 'projectionOverMax', function () {
    return this.projectionOverMax ? this.maxProjection : this.buildYear;
  })
  buildYearMaxed;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  doeUtilChanges;
  @computed('doeUtilChanges.[]', function () {
    return this.doeUtilChanges
      .mapBy('bldg_id')
      .concat(this.doeUtilChanges.mapBy('bldg_id_additional'))
      .without('')
      .uniq();
  })
  doeUtilChangesBldgIds;
  @computed(
    'buildings',
    'doeUtilChanges',
    'doeUtilChangesBldgIds',
    function () {
      const buildingsNoHs = this.buildings.filter((b) => b.level !== 'hs');

      return this.doeUtilChangesBldgIds
        .map((bldg_id) => {
          const buildings = buildingsNoHs.filterBy('bldg_id', bldg_id);

          if (buildings.length === 0) return;

          const doe_notices = this.doeUtilChanges
            .filter(
              (b) => b.bldg_id === bldg_id || b.bldg_id_additional === bldg_id
            )
            .mapBy('title')
            .uniq()
            .map((title) => this.doeUtilChanges.filterBy('title', title));

          return {
            bldg_id,
            buildings,
            doe_notices,
          };
        })
        .compact();
    }
  )
  doeUtilChangesPerBldg;
  @reads('doeUtilChangesPerBldg.length') doeUtilChangesCount;

  @attr('public-schools/residential-developments', {
    defaultValue() {
      return [];
    },
  })
  residentialDevelopments;
  @computed('currentMultiplier', 'residentialDevelopments.[]', function () {
    return this.residentialDevelopments.map((d) => {
      d.set('multipliers', this.currentMultiplier);
      return d;
    });
  })
  futureResidentialDev;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  schoolsWithAction;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  hsProjections;
  @attr('number', { defaultValue: 0 }) hsStudentsFromHousing;
  @attr('', {
    defaultValue() {
      return [];
    },
  })
  futureEnrollmentProjections;
  @attr('', {
    defaultValue() {
      return [];
    },
  })
  futureEnrollmentNewHousing;

  // Tables
  @computed('school_buildings', function () {
    return this.school_buildings.compact();
  })
  allSchools;

  @computed(
    'allSchools',
    'borough',
    'currentMultiplier.{hs,is,ps}',
    'futureEnrollmentNewHousing',
    'futureEnrollmentProjections.@each.{ms,ps}',
    'futureResidentialDev',
    'hsProjections',
    'hsStudentsFromHousing',
    'scaProjects.@each.{hs_capacity,includeInCapacity,is_capacity,ps_capacity}',
    'schoolsWithAction',
    'subdistricts',
    function () {
      const tables = [];

      tables.push(
        SubdistrictTotals.create({
          borough: this.borough,
          level: 'hs',
          allBuildings: this.allSchools,

          studentMultiplier: this.currentMultiplier.hs,

          enroll: this.hsProjections[0] ? this.hsProjections[0].hs : 0,

          students:
            this.hsStudentsFromHousing +
            this.futureResidentialDev.reduce(function (acc, value) {
              return acc + value.hs_students;
            }, 0),

          scaCapacityIncrease: this.scaProjects
            .filterBy('includeInCapacity', true)
            .reduce(function (acc, value) {
              const v = parseFloat(value.hs_capacity);
              if (v) return acc + v;
              return acc;
            }, 0),

          newCapacityWithAction: this.schoolsWithAction.reduce(function (
            acc,
            value
          ) {
            return acc + parseFloat(value.hs_seats);
          },
          0),
        })
      );

      this.subdistricts.map((sd) => {
        tables.push(
          SubdistrictTotals.create({
            ...sd,
            level: 'ps',
            allBuildings: this.allSchools,

            studentMultiplier: this.currentMultiplier.ps,

            enroll: Math.round(
              this.futureEnrollmentProjections.find(
                (i) =>
                  i.district === sd.district && i.subdistrict === sd.subdistrict
              )?.ps
            ),

            students:
              // Students from future housing projected by SCA
              this.futureEnrollmentNewHousing.find(
                (i) =>
                  i.district === sd.district &&
                  i.subdistrict === sd.subdistrict &&
                  i.level === 'PS'
              ).students +
              // Students from user-inputed additional developments
              this.futureResidentialDev
                .filter(
                  (i) =>
                    i.district === sd.district &&
                    i.subdistrict === sd.subdistrict
                )
                .reduce(function (acc, value) {
                  return acc + value.ps_students;
                }, 0),

            scaCapacityIncrease: this.scaProjects
              .filter(
                (b) =>
                  b.district === sd.district &&
                  b.subdistrict === sd.subdistrict &&
                  b.includeInCapacity === true
              )
              .reduce(function (acc, value) {
                const v = parseFloat(value.ps_capacity);
                if (v) return acc + v;
                return acc;
              }, 0),

            newCapacityWithAction: this.schoolsWithAction
              .filter(
                (b) =>
                  b.district === sd.district && b.subdistrict === sd.subdistrict
              )
              .reduce(function (acc, value) {
                return acc + parseFloat(value.ps_seats);
              }, 0),
          })
        );

        tables.push(
          SubdistrictTotals.create({
            ...sd,
            level: 'is',
            allBuildings: this.allSchools,

            studentMultiplier: this.currentMultiplier.is,

            enroll: Math.round(
              this.futureEnrollmentProjections.find(
                (i) =>
                  i.district === sd.district && i.subdistrict === sd.subdistrict
              )?.ms
            ),

            students:
              // Students from future housing projected by SCA
              this.futureEnrollmentNewHousing.find(
                (i) =>
                  i.district === sd.district &&
                  i.subdistrict === sd.subdistrict &&
                  i.level === 'MS'
              ).students +
              // Students from user-inputed additional developments
              this.futureResidentialDev
                .filter(
                  (i) =>
                    i.district === sd.district &&
                    i.subdistrict === sd.subdistrict
                )
                .reduce(function (acc, value) {
                  return acc + value.is_students;
                }, 0),

            scaCapacityIncrease: this.scaProjects
              .filter(
                (b) =>
                  b.district === sd.district &&
                  b.subdistrict === sd.subdistrict &&
                  b.includeInCapacity === true
              )
              .reduce(function (acc, value) {
                const v = parseFloat(value.is_capacity);
                if (v) return acc + v;
                return acc;
              }, 0),

            newCapacityWithAction: this.schoolsWithAction
              .filter(
                (b) =>
                  b.district === sd.district && b.subdistrict === sd.subdistrict
              )
              .reduce(function (acc, value) {
                return acc + parseFloat(value.is_seats);
              }, 0),
          })
        );
      });

      return tables;
    }
  )
  subdistrictTotals;

  @computed(
    'estEsStudents',
    'schoolsWithAction.[]',
    'subdistrictTotals',
    function () {
      return LevelTotals.create({
        subdistrictTotals: this.subdistrictTotals.filterBy('level', 'ps'),
        studentsWithAction: this.estEsStudents || 0,
      });
    }
  )
  psLevelTotals;

  @computed(
    'estIsStudents',
    'schoolsWithAction.[]',
    'subdistrictTotals',
    function () {
      return LevelTotals.create({
        subdistrictTotals: this.subdistrictTotals.filterBy('level', 'is'),
        studentsWithAction: this.estIsStudents || 0,
      });
    }
  )
  isLevelTotals;

  @computed(
    'estHsStudents',
    'schoolsWithAction.[]',
    'subdistrictTotals',
    function () {
      return LevelTotals.create({
        subdistrictTotals: this.subdistrictTotals.filterBy('level', 'hs'),
        studentsWithAction: this.estHsStudents || 0,
      });
    }
  )
  hsLevelTotals;
}
