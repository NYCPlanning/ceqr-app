import Service from '@ember/service';
import carto from 'carto-promises-utility/utils/carto';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

// Give service bbls, 
// returns a promise on everything else, allowing template to use await on all attributes

export default Service.extend({  
  bbls: null,

  init() {
    this._super(...arguments);
    this.set('bbls', []);
  },

  setBbls(bbls) {
    this.set('bbls', bbls);
  },

  bblsPresent() {
    return !isEmpty(this.get('bbls'));
  },

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

  psBuildings: computed('_bluebookCartoIds', function() {
    return this.get('fetchPsBluebook').perform();
  }),
  msBuildings: computed('_bluebookCartoIds', function() {
    return this.get('fetchMsBluebook').perform();
  }),
  // hsBuildings: computed('schoolIds', function() {
  //   return this.get('fetchHsBuildings').perform();
  // }),

  // Internal state transfer
  _subdistrictSqlPairs: null,
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

    // this.set('project.subdistricts', subdistricts.features.map((f) => ({district: f.properties.district, subdistrict: f.properties.subdistrict})));
    // this.set('project.districts', subdistricts.features.map((f) => f.properties.district));
    
    this.set('_subdistrictCartoIds', subdistricts.features.mapBy('properties.cartodb_id'));
    this.set('_subdistrictSqlPairs', subdistricts.features.map(
      (f) => `(${f.properties.district}, ${f.properties.subdistrict})`
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
  
});
