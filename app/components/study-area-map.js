import Component from '@ember/component';
import carto from 'carto-promises-utility/utils/carto';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { task, waitForProperty } from 'ember-concurrency';
// import bbox from 'npm:@turf/bbox';

export default Component.extend({  
  // UI attributes
  zoneDisplay: 'es',
  hsAnalysis: false,
  
  // Map attributes
  map: null,
  mapZoomTo(geojson) {
    // let extent = bbox(geojson);
    // console.log(extent);
    // this.get('map').fitBounds(bbox);
  },

  // District attributes
  subdistrictPairs: null,
  subdistrictIds: null,
  schoolIds: null,

  bblsPresent: computed('bbls.[]', function() {
    return !isEmpty(this.get('bbls'));
  }),
  
  // Geojson
  bblGeojson: computed('bbls.[]', function() {
    return this.get('fetchBbls').perform();
  }),
  subdistrictGeojson: computed('bbls.[]', function() {
    return this.get('fetchSubdistricts').perform();
  }),
  esZonesGeojson: computed('subdistrictPairs', function() {
    return this.get('fetchEsZones').perform();
  }),
  msZonesGeojson: computed('subdistrictPairs', function() {
    return this.get('fetchMsZones').perform();
  }),
  hsZonesGeojson: computed('subdistrictPairs', function() {
    return this.get('fetchHsZones').perform();
  }),
  bluebookGeojson: computed('subdistrictPairs', function() {
    return this.get('fetchBluebook').perform();
  }),

  // Tasks (ember-concurrency)
  fetchBbls: task(function*() {
    return yield carto.SQL(`
      SELECT the_geom, bbl
      FROM mappluto_v1711
      WHERE bbl IN (${this.get('bbls').join(',')})
    `, 'geojson');
  }),
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

    this.set('subdistrictPairs', subdistricts.features.map(
      (f) => `(${f.properties.district}, ${f.properties.subdistrict})`
    ));

    this.set('subdistrictIds', subdistricts.features.map(
      (f) => f.properties.cartodb_id
    ));

    return subdistricts;
  }),
  fetchBluebook: task(function*() {
    yield waitForProperty(this, 'subdistrictPairs');
    let schools = yield carto.SQL(`
      SELECT the_geom, district, subd AS subdistrict, cartodb_id
      FROM doe_bluebook_v1617
      WHERE charter != 'Charter'
        AND org_enroll is not null
        AND x_citywide = ''
        AND x_alternative = ''
        AND organization_name not like '%25ALTERNATIVE LEARNING CENTER%25'
        AND organization_name not like '%25YOUNG ADULT BORO CENTER%25'
        AND (district, subd) IN (VALUES ${this.get('subdistrictPairs').join(',')})
    `, 'geojson');

    this.set('schoolIds', schools.features.map(
      (f) => f.properties.cartodb_id
    ));

    return schools;
  }),
  fetchEsZones: task(function*() {
    yield waitForProperty(this, 'subdistrictPairs');
    return yield carto.SQL(`
      SELECT DISTINCT eszones.the_geom, eszones.remarks, eszones.esid_no AS id  
      FROM support_school_zones_es AS eszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('subdistrictIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, eszones.the_geom)
    `, 'geojson')
  }),
  fetchMsZones: task(function*() {
    yield waitForProperty(this, 'subdistrictPairs');
    return yield carto.SQL(`
      SELECT DISTINCT mszones.the_geom, mszones.remarks, mszones.msid_no AS id  
      FROM support_school_zones_ms AS mszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('subdistrictIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, mszones.the_geom)
    `, 'geojson')
  }),
  fetchHsZones: task(function*() {
    yield waitForProperty(this, 'subdistrictPairs');
    return yield carto.SQL(`
      SELECT DISTINCT hszones.the_geom, hszones.remarks, hszones.hsid_no AS id  
      FROM support_school_zones_hs AS hszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('subdistrictIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, hszones.the_geom)
    `, 'geojson')
  }),

  actions: {
    handleMapLoad(map) {
      this.set('map', map);
      window.map = map;
    },
  }
});
