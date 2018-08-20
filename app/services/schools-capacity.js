import Service from '@ember/service';
import { task } from 'ember-concurrency';
import carto from 'carto-promises-utility/utils/carto';
import Building from '../decorators/Building';

export default Service.extend({
  project: null,

  initialLoad: task(function*() {
    yield this.get('fullReload').perform();
  }),
  addSubdistrict: task(function*() {
    yield this.get('fullReload').perform();
  }),

  fullReload: task(function*() {
    yield this.get('setSubdistricts').perform();
    yield this.get('setBluebook').perform();
    yield this.get('setLCGMS').perform();
    yield this.get('setProjections').perform();
    yield this.get('setEnrollmentMultipliers').perform();
    yield this.get('setStudentsFromNewHousing').perform();
    yield this.get('setSCAProjects').perform();
    yield this.get('setDOEUtilChanges').perform();

    this.get('project').save();
  }),

  // Individual tasks
  setSubdistricts: task(function*() {
    let subdistricts = yield carto.SQL(`
      SELECT DISTINCT
        subdistricts.cartodb_id,
        subdistricts.the_geom,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017 AS subdistricts, (
        SELECT the_geom, bbl
        FROM mappluto_v1711
        WHERE bbl IN (${this.get('project.bbls').join(',')})
      ) pluto
      WHERE ST_Intersects(pluto.the_geom, subdistricts.the_geom)
    `);

    this.set('project.subdistrictsFromDB', subdistricts.map(
      (f) => ({
        district: f.district,
        subdistrict: f.subdistrict,
        cartodb_id: f.cartodb_id,
        id: parseInt(`${f.district}${f.subdistrict}`),
        sdName: `District ${f.district} - Subdistrict ${f.subdistrict}`
      })
    ));
  }),

  setBluebook: task(function*() {
    
    let bluebookHs = [];
    if (this.get('project.hsAnalysis')) {
      bluebookHs = yield carto.SQL(`
      SELECT
        cartodb_id,
        district,
        subd AS subdistrict,
        bldg_name,
        CASE WHEN bldg_excl is null THEN false 
            ELSE true END
            AS excluded,
        bldg_id,
        org_id,
        org_level,
        organization_name AS name,
        address,
        org_level,

        hs_capacity,
        ROUND(hs_enroll) AS hs_enroll
      FROM doe_bluebook_v1617
      WHERE charter != 'Charter'
        AND org_enroll is not null
        AND x_citywide = ''
        AND x_alternative = ''
        AND organization_name not like '%25ALTERNATIVE LEARNING CENTER%25'
        AND organization_name not like '%25YOUNG ADULT BORO CENTER%25'
        AND left(geo_borocd::text, 1) = '${this.get('project.boroCode')}'
    `);
    }

    let bluebook = yield carto.SQL(`
      SELECT
        cartodb_id,
        district,
        subd AS subdistrict,
        bldg_name,
        CASE WHEN bldg_excl is null THEN false 
            ELSE true END
            AS excluded,
        bldg_id,
        org_id,
        org_level,
        organization_name AS name,
        address,
        org_level,

        ps_capacity,
        ROUND(ps_enroll) AS ps_enroll,
        ms_capacity,
        ROUND(ms_enroll) AS ms_enroll,
        hs_capacity,
        ROUND(hs_enroll) AS hs_enroll
      FROM doe_bluebook_v1617
      WHERE charter != 'Charter'
        AND org_enroll is not null
        AND x_citywide = ''
        AND x_alternative = ''
        AND organization_name not like '%25ALTERNATIVE LEARNING CENTER%25'
        AND organization_name not like '%25YOUNG ADULT BORO CENTER%25'
        AND (district, subd) IN (VALUES ${this.get('project.subdistrictSqlPairs').join(',')})
    `);

    let bluebookBuildings = [];

    bluebook.forEach((b) => {
      if (/PS/.test(b.org_level)) {
        const existing = this.get('project.bluebook').filter(
          (e) => e.org_id === b.org_id && e.bldg_id === b.bldg_id && e.level === 'ps'
        )[0];

        bluebookBuildings.push(Building.create({
          ...b,
          level: 'ps',
          source: 'bluebook',
          capacity: b.ps_capacity,
          capacityFuture: existing ? existing.capacityFuture : b.ps_capacity,
          enroll: b.ps_enroll
        }));
      }     

      if (/IS/.test(b.org_level)) {
        const existing = this.get('project.bluebook').filter(
          (e) => e.org_id === b.org_id && e.bldg_id === b.bldg_id && e.level === 'is'
        )[0];

        bluebookBuildings.push(Building.create({
          ...b,
          level: 'is',
          source: 'bluebook',
          capacity: b.ms_capacity,
          capacityFuture: existing ? existing.capacityFuture : b.ms_capacity,
          enroll: b.ms_enroll
        }));
      }
    });

    bluebookHs.forEach((b) => {
      if (/HS/.test(b.org_level)) {
        const existing = this.get('project.buildings').filter(
          (e) => e.org_id === b.org_id && e.bldg_id === b.bldg_id && e.org_level === 'hs'
        )[0];

        bluebookBuildings.push(Building.create({
          ...b,
          level: 'hs',
          source: 'bluebook',
          capacity: b.hs_capacity,
          capacityFuture: existing ? existing.capacityFuture : b.hs_capacity,
          enroll: b.hs_enroll
        }));
      }
    });

    this.set('project.bluebook', bluebookBuildings);
  }),

  setLCGMS: task(function*() {
    let lcgms = yield carto.SQL(`
      SELECT
        lcgms.the_geom,
        lcgms.name,
        lcgms.address,
        lcgms.bldg_id,
        lcgms.org_id,
        lcgms.grades,
        lcgms.org_level,
        lcgms.ps_enroll,
        lcgms.is_enroll,
        lcgms.hs_enroll,
        lcgms.cartodb_id,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM ceqr_lcgms_v2017 AS lcgms, (
        SELECT the_geom, schooldist, zone
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('project.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, lcgms.the_geom)   
    `);

    let lcgmsBuildings = [];

    lcgms.forEach((b) => {
      let isPs = b.org_level.includes('PS');
      let isIs = b.org_level.includes('IS');
      let isHs = b.org_level.includes('HS');

      const previousSaved = this.get('project.lcgms').findBy('org_id', b.org_id);

      if (isPs) lcgmsBuildings.push(Building.create({
        ...b,
        level: 'ps',
        source: 'lcgms',
        enroll: b.ps_enroll,
        capacity: previousSaved ? previousSaved.capacity : '',
      }));
      
      if (isIs) lcgmsBuildings.push(Building.create({
        ...b,
        level: 'is',
        source: 'lcgms',
        enroll: b.is_enroll,
        capacity: previousSaved ? previousSaved.capacity : '',
      }));
      
      // Still need to deal with HS from LCGMS; will wait until LCGMS data issues are addressed
      if (isHs) lcgmsBuildings.push(Building.create({
        ...b,
        level: 'hs',
        source: 'lcgms',
        enroll: b.hs_enroll,
        capacity: previousSaved ? previousSaved.capacity : '',
      }));
    });

    this.set('project.lcgms', lcgmsBuildings);
  }),

  setProjections: task(function*() {
    let hsProjections = yield carto.SQL(`
      SELECT borough, year, hs
      FROM hs_sca_projections_2025_v1
      WHERE year = ${this.get('project.buildYearMaxed')} AND
        LOWER(borough) = LOWER('${this.get('project.borough')}')
    `);
    this.set('project.hsProjections', hsProjections);

    let enrollmentProjections = yield carto.SQL(`
      SELECT
        projected_ps_dist AS ps,
        projected_ms_dist AS ms,
        CAST(district AS numeric)
      FROM ceqr_sf_projection_2016_2025
      WHERE school_year LIKE '${this.get('project.buildYearMaxed')}%25'
        AND district IN (${this.get('project.subdistricts').map((d) => `'${d.district}'`).join(',')})
    `);
    this.set('project.futureEnrollmentProjections', enrollmentProjections);
  }),

  setEnrollmentMultipliers: task(function*() {
    let enrollmentMultipliers = yield carto.SQL(`
      SELECT zone_of_dist AS multiplier, disgeo AS district, zone AS subdistrict, TRIM(level) AS level
      FROM ceqr_2019_enrollment_by_zone
      WHERE (disgeo, zone) IN (VALUES ${this.get('project.subdistrictSqlPairs').join(',')})
    `);
    this.set('project.futureEnrollmentMultipliers', enrollmentMultipliers);
  }),

  setStudentsFromNewHousing: task(function*() {
    let studentsFromNewHousing = yield carto.SQL(`
      SELECT students_from_new_housing AS students, dist AS district, zone AS subdistrict, TRIM(grade_level) AS level
      FROM ceqr_housing_by_sd_2016
      WHERE (dist, zone) IN (VALUES ${this.get('project.subdistrictSqlPairs').join(',')})
    `);
    this.set('project.futureEnrollmentNewHousing', studentsFromNewHousing);
  }),

  setSCAProjects: task(function*() {
    let scaProjects = yield carto.SQL(`
      SELECT
        projects.bbl,
        projects.name,
        projects.cartodb_id,
        projects.bldg_id,
        projects.capacity,
        projects.start_date,
        projects.planned_end_date,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM (
          SELECT the_geom, schooldist, zone
          FROM doe_schoolsubdistricts_v2017
          WHERE cartodb_id IN (${this.get('project.subdistrictCartoIds').join(',')})
        ) AS subdistricts,
        sca_capital_projects_v032018 AS projects
      WHERE ST_Intersects(subdistricts.the_geom, projects.the_geom)
    `);
    this.set('project.scaProjects', scaProjects.map((b) => {
      const existing = this.get('project.scaProjects').findBy('bldg_id', b.bldg_id);
      return Building.create({
        ...b,
        data_as_of: '2018-03-21', // Hard coded for now. Not good.
        ps_capacity: existing ? existing.ps_capacity : '',
        is_capacity: existing ? existing.is_capacity : '',
        hs_capacity: existing ? existing.hs_capacity : '',
        includeInCapacity: existing ? existing.includeInCapacity : false,
      })
    }));
  }),

  setDOEUtilChanges: task(function*() {
    let doeUtilChanges = yield carto.SQL(`
      SELECT
        at_scale_year,
        at_scale_enroll,
        bldg_id,
        bup_url,
        eis_url,
        title
      FROM doe_significant_utilization_changes_v022018
      WHERE bldg_id IN (${this.get('project.buildingsBldgIds').map(b => `'${b}'`).join(',')})
    `);
    this.set('project.doeUtilChanges', doeUtilChanges);
  }),
});
