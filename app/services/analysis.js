import Service from '@ember/service';
import carto from 'carto-promises-utility/utils/carto';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';


export default Service.extend({  
  // BBLs and Build Year are set by observers on the project model
  bbls: null,
  buildYear: null,

  init() {
    this._super(...arguments);
    this.set('bbls', []);
  },

  setBuildYear(buildYear) {
    this.set('buildYear', buildYear);
  },
  setBbls(bbls) {
    this.set('bbls', bbls);
  },
  bblsPresent() {
    return !isEmpty(this.get('bbls'));
  },
  // Found online: http://www.jacklmoore.com/notes/rounding-in-javascript/
  round: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  },


  // Geojson
  bblGeojson: computed('bbls.[]', function() {
    return this.get('fetchBbls').perform();
  }),
  subdistrictGeojson: computed('bbls.[]', function() {
    return this.get('fetchSubdistricts').perform();
  }),
  bluebookGeojson: computed('_subdistrictSqlPairs.[]', function() {
    return this.get('fetchBluebookGeojson').perform();
  }),
  esZonesGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchEsZones').perform();
  }),
  isZonesGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchIsZones').perform();
  }),
  hsZonesGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchHsZones').perform();
  }),
  scaProjectsGeojson: computed('_subdistrictSqlPairs.[]', function() {
    return this.get('fetchScaProjects').perform();
  }),
  lcgmsGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchLcgmsGeojson').perform();
  }),


  // Result objects
  resultsNoAction: computed('buildYear', '_bluebookCartoIds.[]', '_subdistrictSqlPairs.[]', function() {
    return this.get('generateNoActionResults').perform();
  }),


  // Internal state transfer
  _subdistrictSqlPairs: null,
  _subdistrictObjectPairs: null,
  _subdistrictCartoIds: null,
  _bluebookCartoIds: null,
  _lcgms: null,
  _scaProjects: null,


  // Tasks (ember-concurrency)
  fetchBbls: task(function*() {
    yield waitForProperty(this, 'bbls');
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom, bbl
      FROM mappluto_v1711
      WHERE bbl IN (${this.get('bbls').join(',')})
    `, 'geojson');
  }).restartable(),
  fetchSubdistricts: task(function*() {
    let subdistricts = yield carto.SQL(`
      SELECT DISTINCT
        subdistricts.cartodb_id,
        subdistricts.the_geom,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017 AS subdistricts, (
        SELECT the_geom, bbl
        FROM mappluto_v1711
        WHERE bbl IN (${this.get('bbls').join(',')})
      ) pluto
      WHERE ST_Intersects(pluto.the_geom, subdistricts.the_geom)
    `, 'geojson');

    
    this.set('_subdistrictCartoIds', subdistricts.features.mapBy('properties.cartodb_id'));
    this.set('_subdistrictSqlPairs', subdistricts.features.map(
      (f) => `(${f.properties.district}, ${f.properties.subdistrict})`
    ));
    this.set('_subdistrictObjectPairs', subdistricts.features.map(
      (f) => ({district: f.properties.district, subdistrict: f.properties.subdistrict})
    ));

    return subdistricts;
  }).restartable(),
  fetchBluebookGeojson: task(function*() {
    yield waitForProperty(this, '_subdistrictSqlPairs');
    let bluebook = yield carto.SQL(`
      SELECT the_geom, district, subd AS subdistrict, cartodb_id
      FROM doe_bluebook_v1617
      WHERE charter != 'Charter'
        AND org_enroll is not null
        AND x_citywide = ''
        AND x_alternative = ''
        AND organization_name not like '%25ALTERNATIVE LEARNING CENTER%25'
        AND organization_name not like '%25YOUNG ADULT BORO CENTER%25'
        AND (district, subd) IN (VALUES ${this.get('_subdistrictSqlPairs').join(',')})
    `, 'geojson');

    this.set('_bluebookCartoIds', bluebook.features.mapBy('properties.cartodb_id'));

    return bluebook;
  }).restartable(),

  // Attribute: school year not captured in Bluebook
  fetchLcgmsGeojson: task(function*() {
    yield waitForProperty(this, '_subdistrictCartoIds');
    let lcgms = yield carto.SQL(`
      SELECT
        lcgms.the_geom,
        lcgms.open_date,
      lcgms.location_name AS name,
        lcgms.grades,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM doe_lcgms_v201718 AS lcgms, (
        SELECT the_geom, schooldist, zone
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('_subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE open_date LIKE '%252017'
        AND managed_by_name = 'DOE'
        AND ST_Intersects(subdistricts.the_geom, lcgms.the_geom)   
    `, 'geojson');

    this.set('_lcgms', lcgms.features.map((b) => b.properties));

    return lcgms;
  }).restartable(),
  fetchEsZones: task(function*() {
    yield waitForProperty(this, '_subdistrictCartoIds');
    return yield carto.SQL(`
      SELECT DISTINCT eszones.the_geom, eszones.remarks, eszones.esid_no AS id  
      FROM support_school_zones_es AS eszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('_subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, eszones.the_geom)
    `, 'geojson')
  }).restartable(),
  fetchIsZones: task(function*() {
    yield waitForProperty(this, '_subdistrictCartoIds');
    return yield carto.SQL(`
      SELECT DISTINCT mszones.the_geom, mszones.remarks, mszones.msid_no AS id  
      FROM support_school_zones_ms AS mszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('_subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, mszones.the_geom)
    `, 'geojson')
  }).restartable(),
  fetchHsZones: task(function*() {
    yield waitForProperty(this, '_subdistrictCartoIds');
    return yield carto.SQL(`
      SELECT DISTINCT hszones.the_geom, hszones.remarks, hszones.hsid_no AS id  
      FROM support_school_zones_hs AS hszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('_subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, hszones.the_geom)
    `, 'geojson')
  }).restartable(),
  fetchScaProjects: task(function*() {
    yield waitForProperty(this, '_subdistrictCartoIds');    
    let projects = yield carto.SQL(`
      SELECT
        projects.the_geom,
        projects.bbl,
        projects.school,
        construction.data_as_of,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM (
          SELECT the_geom, schooldist, zone
          FROM doe_schoolsubdistricts_v2017
          WHERE cartodb_id IN (${this.get('_subdistrictCartoIds').join(',')})
        ) AS subdistricts,
        sca_project_sites_v03222018 AS projects
      JOIN (
        SELECT bbl, MAX(to_timestamp(data_as_of, 'MM/DD/YYYY')) AS data_as_of
        FROM sca_project_construction_v02222018
        GROUP BY bbl
      ) construction 
      ON projects.bbl = construction.bbl
      WHERE ST_Intersects(subdistricts.the_geom, projects.the_geom)
    `, 'geojson')

    this.set('_scaProjects', projects.features.map((b) => b.properties));

    return projects;
  }).restartable(),

  generateNoActionResults: task(function*() {
    yield waitForProperty(this, '_bluebookCartoIds');
    let psBluebook = yield carto.SQL(`
      SELECT
        district,
        subd AS subdistrict,
        bldg_name,
        organization_name AS name,
        address,
        org_level AS grades,
        ROUND(ps_enroll) AS enroll,
        CASE WHEN bldg_excl is null THEN ps_capacity
             ELSE null END
             AS capacity,
        CASE WHEN bldg_excl is null THEN ROUND(ps_capacity - ps_enroll)
             ELSE ROUND(0 - ps_enroll) END
             AS seats,
        CASE WHEN bldg_excl is null THEN ROUND((ps_enroll / ps_capacity)::numeric, 3)
             ELSE null END
             AS utilization
      FROM doe_bluebook_v1617
      WHERE cartodb_id IN (${this.get('_bluebookCartoIds').join(',')})
        AND org_level like '%25PS%25'
    `);
    psBluebook.map((school) => school.type = 'bluebook');

    let isBluebook = yield carto.SQL(`
      SELECT
        district,
        subd AS subdistrict,
        organization_name AS name,
        address,
        org_level AS grades,
        ROUND(ms_enroll) AS enroll,
        CASE WHEN bldg_excl is null THEN ms_capacity
            ELSE null END
            AS capacity,
        CASE WHEN bldg_excl is null THEN ROUND(ms_capacity - ms_enroll)
            ELSE ROUND(0 - ms_enroll) END
            AS seats,
        CASE WHEN bldg_excl is null THEN ROUND((ms_enroll / ms_capacity)::numeric, 3)
            ELSE null END
            AS utilization
      FROM doe_bluebook_v1617
      WHERE cartodb_id IN (${this.get('_bluebookCartoIds').join(',')})
        AND org_level like '%25IS%25'
    `);
    isBluebook.map((school) => school.type = 'bluebook');

    yield waitForProperty(this, 'buildYear');
    let enrollmentProjections = yield carto.SQL(`
      SELECT projected_ps_dist, projected_ms_dist, CAST(district AS numeric)
      FROM ceqr_sf_projection_2016_2025
      WHERE school_year LIKE '${this.get('buildYear')}%25'
        AND district IN (${this.get('_subdistrictObjectPairs').map((d) => `'${d.district}'`).join(',')})
    `);

    yield waitForProperty(this, '_subdistrictSqlPairs');
    let enrollmentMultipliers = yield carto.SQL(`
      SELECT zone_of_dist AS multiplier, disgeo AS district, zone AS subdistrict, TRIM(level) AS level
      FROM ceqr_2019_enrollment_by_zone
      WHERE (disgeo, zone) IN (VALUES ${this.get('_subdistrictSqlPairs').join(',')})
    `);

    let studentsFromNewHousing = yield carto.SQL(`
      SELECT students_from_new_housing AS students, dist AS district, zone AS subdistrict, TRIM(grade_level) AS level
      FROM ceqr_housing_by_sd_2016
      WHERE (dist, zone) IN (VALUES ${this.get('_subdistrictSqlPairs').join(',')})
    `);

    yield waitForProperty(this, '_lcgms');
    let lcgmsSchools = {
      ps: [],
      is: [],
      hs: [],
    };

    this.get('_lcgms').forEach((school) => {
      school.type = 'lcgms';
      
      let grades = school.grades.split(',');
      
      let isPs = grades.some(g => ['0K','01','02','03','04','05'].includes(g));
      let isIs = grades.some(g => ['06','07','08'].includes(g));
      let isHs = grades.some(g => ['09','10','11','12'].includes(g));

      if (isPs) lcgmsSchools.ps.push(school);
      if (isIs) lcgmsSchools.is.push(school);
      if (isHs) lcgmsSchools.hs.push(school);
    });

    yield waitForProperty(this, '_scaProjects');

    return this.get('_subdistrictObjectPairs').map((s) => {
      // Primary Schools
      let psBluebookBuildings = psBluebook.filter(
        (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
      );
      let psLcgmsBuildings = lcgmsSchools.ps.filter(
        (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
      )
      let psBuildings = psBluebookBuildings.concat(psLcgmsBuildings);

      let psEnrollmentTotal = psBuildings.mapBy('enroll').reduce((acc, value) => acc + value);
      let psCapacityTotal = psBuildings.mapBy('capacity').reduce((acc, value) => acc + value);
      let psSeatsTotal = psBuildings.mapBy('seats').reduce((acc, value) => acc + value);
      let psUtilization = this.round((psEnrollmentTotal / psCapacityTotal), 3);

      // Intermediary Schools
      let isBuildings = isBluebook.filter(
        (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
      );
      let isEnrollmentTotal = isBuildings.mapBy('enroll').reduce((acc, value) => acc + value);
      let isCapacityTotal = isBuildings.mapBy('capacity').reduce((acc, value) => acc + value);
      let isSeatsTotal = isBuildings.mapBy('seats').reduce((acc, value) => acc + value);
      let isUtilization = this.round((isEnrollmentTotal / isCapacityTotal), 3);

  
      let dEnrollmentProjection = enrollmentProjections.findBy('district', s.district);
      let sdPsEnrollment = enrollmentMultipliers.find(
        (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'PS')
      );
      let sdIsEnrollment = enrollmentMultipliers.find(
        (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'MS')
      );

      // Future No Action
      let projectedEnroll = {
        ps: Math.round(dEnrollmentProjection.projected_ps_dist * sdPsEnrollment.multiplier),
        is: Math.round(dEnrollmentProjection.projected_ms_dist * sdIsEnrollment.multiplier)
      };
      let projectedNewStudents = {
        ps: studentsFromNewHousing.find(
          (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'PS')
        ).students,
        is: studentsFromNewHousing.find(
          (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'MS')
        ).students
      };
      let scaUnderConstruction = this.get('_scaProjects').filter(
        (b) => (b.district === s.district && b.subdistrict === s.subdistrict)
      );


      return {
        district: s.district,
        subdistrict: s.subdistrict,
        sdId: parseInt(`${s.district}${s.subdistrict}`),

        psBuildings,
        psEnrollmentTotal,
        psCapacityTotal,
        psSeatsTotal,
        psUtilization,

        isBuildings,
        isEnrollmentTotal,
        isCapacityTotal,
        isSeatsTotal,
        isUtilization,

        futureNoAction: {
          scaUnderConstruction,
          ps: {
            projectedEnroll: projectedEnroll.ps,
            projectedNewStudents: projectedNewStudents.ps,
            projectedTotalEnroll: projectedEnroll.ps + projectedNewStudents.ps,
            projectedCapacity: psCapacityTotal,
            projectedAvailSeats: psCapacityTotal - (projectedEnroll.ps + projectedNewStudents.ps),
            projectedUtilization: this.round(((projectedEnroll.ps + projectedNewStudents.ps) / psCapacityTotal), 3)
          },
          is: {
            projectedEnroll: projectedEnroll.is,
            projectedNewStudents: projectedNewStudents.is, 
            projectedTotalEnroll: projectedEnroll.is + projectedNewStudents.is,
            projectedCapacity: isCapacityTotal,
            projectedAvailSeats: isCapacityTotal - (projectedEnroll.is + projectedNewStudents.is),
            projectedUtilization: this.round(((projectedEnroll.is + projectedNewStudents.is) / isCapacityTotal), 3)
          }
        }
      }
    });
  }).restartable(),
});
