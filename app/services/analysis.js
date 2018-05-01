import Service from '@ember/service';
import carto from 'carto-promises-utility/utils/carto';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

// Give service bbls, 
// returns a promise on everything else, allowing template to use await on all attributes

// Always refer to Primary and Intermediate schools

export default Service.extend({  
  bbls: null,
  buildYear: null,

  init() {
    this._super(...arguments);
    this.set('bbls', []);
    this.set('buildYear', 2019);
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

  // Geojson
  bblGeojson: computed('bbls.[]', function() {
    return this.get('fetchBbls').perform();
  }),
  subdistrictGeojson: computed('bbls.[]', function() {
    return this.get('fetchSubdistricts').perform();
  }),

  bluebookGeojson: computed('_subdistrictSqlPairs.[]', function() {
    return this.get('fetchBluebook').perform();
  }),
  esZonesGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchEsZones').perform();
  }),
  msZonesGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchMsZones').perform();
  }),
  hsZonesGeojson: computed('_subdistrictCartoIds.[]', function() {
    return this.get('fetchHsZones').perform();
  }),

  // Table Arrays
  psBuildings: computed('_bluebookCartoIds.[]', function() {
    return this.get('fetchPsBluebook').perform();
  }),
  msBuildings: computed('_bluebookCartoIds.[]', function() {
    return this.get('fetchMsBluebook').perform();
  }),
  // hsBuildings: computed('schoolIds', function() {
  //   return this.get('fetchHsBuildings').perform();
  // }),
  psNoActionTotals: computed('buildYear', '_subdistrictSqlPairs.[]', function() {
    return this.get('buildNoActionTotals').perform();
  }),
  isNoActionTotals: null,
  hsNoActionTotals: null,

  // Found online: http://www.jacklmoore.com/notes/rounding-in-javascript/
  round: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  },

  // Totals
  _psEnrollment: computed.mapBy('psBuildings.value', 'enroll'),
  _psSeats: computed.mapBy('psBuildings.value', 'seats'),
  _psCapacity: computed.mapBy('psBuildings.value', 'capacity'),
  _msEnrollment: computed.mapBy('msBuildings.value', 'enroll'),
  _msSeats: computed.mapBy('msBuildings.value', 'seats'),
  _msCapacity: computed.mapBy('msBuildings.value', 'capacity'),

  psEnrollmentTotal: computed.sum('_psEnrollment'),
  psCapacityTotal: computed.sum('_psCapacity'),
  psSeatsTotal: computed.sum('_psSeats'),
  psUtilization: computed('psEnrollmentTotal', 'psCapacityTotal', function() {
    return this.round(this.get('psEnrollmentTotal') / this.get('psCapacityTotal'), 3);
  }),

  msEnrollmentTotal: computed.sum('_msEnrollment'),
  msCapacityTotal: computed.sum('_msCapacity'),
  msSeatsTotal: computed.sum('_msSeats'),
  msUtilization: computed('msEnrollmentTotal', 'msCapacityTotal', function() {
    return this.round(this.get('msEnrollmentTotal') / this.get('msCapacityTotal'), 3);
  }),

  // Internal state transfer
  _subdistrictSqlPairs: null,
  _subdistrictObjectPairs: null,
  _subdistrictCartoIds: null,
  _bluebookCartoIds: null,

  // Tasks (ember-concurrency)
  fetchBbls: task(function*() {
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
  fetchBluebook: task(function*() {
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
  fetchMsZones: task(function*() {
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
  fetchPsBluebook: task(function*() {
    yield waitForProperty(this, '_bluebookCartoIds');
    return yield carto.SQL(`
      SELECT
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
  }).restartable(),
  fetchMsBluebook: task(function*() {
    yield waitForProperty(this, '_bluebookCartoIds');
    return yield carto.SQL(`
      SELECT
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
  }).restartable(),
  buildNoActionTotals: task(function*() {
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

    return this.get('_subdistrictObjectPairs').map((s) => {
      let dEnrollmentProjection = enrollmentProjections.findBy('district', s.district);
      let sdPsEnrollment = enrollmentMultipliers.find(
        (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'PS')
      );
      let sdIsEnrollment = enrollmentMultipliers.find(
        (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'MS')
      );

      let psCurrentEnroll = Math.round(dEnrollmentProjection.projected_ps_dist * sdPsEnrollment.multiplier);
      let isCurrentEnroll = Math.round(dEnrollmentProjection.projected_ms_dist * sdIsEnrollment.multiplier);

      let psNewStudents = studentsFromNewHousing.find(
        (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'PS')
      ).students;
      let isNewStudents = studentsFromNewHousing.find(
        (i) => (i.district === s.district && i.subdistrict === s.subdistrict && i.level === 'MS')
      ).students;

      return {
        area: `CSD ${s.district} Subdistrict ${s.subdistrict}`,
        psCurrentEnroll,
        isCurrentEnroll,
        psNewStudents,
        isNewStudents,
        psTotalEnroll: psCurrentEnroll + psNewStudents,
        isTotalEnroll: isCurrentEnroll + isNewStudents
      };
    });
  }).restartable(),
});
