import Service from '@ember/service';
import { task } from 'ember-concurrency';
import carto from 'carto-promises-utility/utils/carto';
import Building from '../decorators/Building';

export default Service.extend({
  analysis: null,

  initialLoad: task(function*() {
    yield this.get('fullReload').perform();
  }),
  addSubdistrict: task(function*() {
    yield this.get('fullReload').perform();
  }),

  fullReload: task(function*() {
    yield this.get('setSubdistricts').perform();
    yield this.get('setSchoolChoice').perform();
    yield this.get('setBluebook').perform();
    yield this.get('setLCGMS').perform();
    yield this.get('setProjections').perform();
    yield this.get('setEnrollmentMultipliers').perform();
    yield this.get('setStudentsFromNewHousing').perform();
    yield this.get('setSCAProjects').perform();
    yield this.get('setDOEUtilChanges').perform();

    this.get('analysis').save();
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
        WHERE bbl IN (${this.analysis.bbls.join(',')})
      ) pluto
      WHERE ST_Intersects(pluto.the_geom, subdistricts.the_geom)
    `);

    this.set('analysis.subdistrictsFromDb', subdistricts.map(
      (f) => ({
        district: f.district,
        subdistrict: f.subdistrict,
        cartodb_id: f.cartodb_id,
        id: parseInt(`${f.district}${f.subdistrict}`),
        sdName: `District ${f.district} - Subdistrict ${f.subdistrict}`
      })
    ));
  }),

  setSchoolChoice: task(function*() {
    let es_zone = yield carto.SQL(`
      SELECT *
      FROM doe_schoolchoice_v2018
      WHERE
        district = ${this.analysis.district} AND
        level = 'ES'
    `);

    let is_zone = yield carto.SQL(`
    SELECT *
    FROM doe_schoolchoice_v2018
    WHERE
      district = ${this.analysis.district} AND
      level = 'IS'
    `);

    this.set('analysis.esSchoolChoice', es_zone[0] ? true : false);
    this.set('analysis.isSchoolChoice', is_zone[0] ? true : false);
  }),

  setBluebook: task(function*() {
    let bluebookHs = [];
    if (this.get('analysis.hsAnalysis')) {
      bluebookHs = yield carto.SQL(`
      SELECT *
      FROM ceqr_bluebook_v2017
      WHERE borocode = '${this.get('analysis.boroCode')}'
    `);
    }

    let bluebook = yield carto.SQL(`
      SELECT *
      FROM ceqr_bluebook_v2017
      WHERE (district, subdistrict) IN (VALUES ${this.get('analysis.subdistrictSqlPairs').join(',')})
    `);

    let bluebookBuildings = [];

    bluebook.forEach((b) => {
      if (/PS/.test(b.org_level)) {
        const existing = this.get('analysis.bluebook').filter(
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
        const existing = this.get('analysis.bluebook').filter(
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
        const existing = this.get('analysis.buildings').filter(
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

    this.set('analysis.bluebook', bluebookBuildings);
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
        WHERE cartodb_id IN (${this.get('analysis.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, lcgms.the_geom)   
    `);

    let lcgmsBuildings = [];

    lcgms.forEach((b) => {
      let isPs = b.org_level.includes('PS');
      let isIs = b.org_level.includes('IS');
      let isHs = b.org_level.includes('HS');

      const previousSaved = this.get('analysis.lcgms').findBy('org_id', b.org_id);

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

    this.set('analysis.lcgms', lcgmsBuildings);
  }),

  setEnrollmentMultipliers: task(function*() {
    let enrollmentMultipliers = yield carto.SQL(`
      SELECT *
      FROM enrollment_pct_by_sd_v2017
      WHERE (district, subdistrict) IN (VALUES ${this.get('analysis.subdistrictSqlPairs').join(',')})
    `);
    this.set('analysis.futureEnrollmentMultipliers', enrollmentMultipliers);
  }),

  setProjections: task(function*() {
    let enrollmentProjections = yield carto.SQL(`
      SELECT
        ps,
        ms,
        district,
        school_year
      FROM ceqr_enrollment_projections_sd_v2017
      WHERE 
        school_year LIKE '${this.get('analysis.buildYearMaxed')}%25'
        AND 
        district IN (${this.get('analysis.subdistricts').map((d) => `'${d.district}'`).join(',')})
    `);
    this.set('analysis.futureEnrollmentProjections', enrollmentProjections);

    let hsProjections = yield carto.SQL(`
      SELECT
        borough,
        year,
        hs
      FROM ceqr_enrollment_projections_boro_v2017
      WHERE 
        year = ${this.get('analysis.buildYearMaxed')}
        AND
        LOWER(borough) = LOWER('${this.get('analysis.borough')}')
    `);
    this.set('analysis.hsProjections', hsProjections);
  }),

  setStudentsFromNewHousing: task(function*() {
    let studentsFromNewHousing = yield carto.SQL(`
      SELECT 
        new_students AS students,
        district,
        subdistrict,
        org_level AS level
      FROM ceqr_housing_pipeline_sd_v2017
      WHERE (district, subdistrict) IN (VALUES ${this.get('analysis.subdistrictSqlPairs').join(',')})
    `);
    this.set('analysis.futureEnrollmentNewHousing', studentsFromNewHousing);

    let hsStudentsFromHousing = yield carto.SQL(`
      SELECT
        borough,
        new_students AS hs_students
      FROM ceqr_housing_pipeline_boro_v2017
      WHERE LOWER(borough) = LOWER('${this.get('analysis.borough')}')
    `);
    this.set('analysis.hsStudentsFromHousing', hsStudentsFromHousing[0].hs_students)
  }),

  setSCAProjects: task(function*() {
    let scaProjects = yield carto.SQL(`
      SELECT
        projects.*,
        subdistricts.schooldist AS district,
        subdistricts.zone AS subdistrict
      FROM (
          SELECT the_geom, schooldist, zone
          FROM doe_schoolsubdistricts_v2017
          WHERE cartodb_id IN (${this.get('analysis.subdistrictCartoIds').join(',')})
        ) AS subdistricts,
        sca_capital_projects_v2017 AS projects
      WHERE ST_Intersects(subdistricts.the_geom, projects.the_geom)
    `);
    this.set('analysis.scaProjects', scaProjects.map((b) => {
      const existing = this.get('analysis.scaProjects').findBy('project_dsf', b.project_dsf);
      return Building.create({
        ...b,
        ps_capacity: existing ? existing.ps_capacity : (b.guessed_pct ? 0 : b.capacity * b.pct_ps),
        is_capacity: existing ? existing.is_capacity : (b.guessed_pct ? 0 : b.capacity * b.pct_is),
        hs_capacity: existing ? existing.hs_capacity : (b.guessed_pct ? 0 : b.capacity * b.pct_hs),
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
        bldg_id_additional,
        org_id,
        url,
        vote_date,
        title
      FROM doe_significant_utilization_changes_v062018
      WHERE 
        bldg_id IN (${this.get('analysis.buildingsBldgIds').map(b => `'${b}'`).join(',')}) OR
        bldg_id_additional IN (${this.get('analysis.buildingsBldgIds').map(b => `'${b}'`).join(',')})
    `);
    this.set('analysis.doeUtilChanges', doeUtilChanges);
  }),
});
