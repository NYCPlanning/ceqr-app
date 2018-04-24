import Component from '@ember/component';
import carto from 'carto-promises-utility/utils/carto';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { task, waitForProperty } from 'ember-concurrency';

export default Component.extend({
  // District attributes
  subdistrictPairs: null,
  subdistrictIds: null,
  zoneDisplay: 'es',
  hsAnalysis: false,

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
      (f) => `(${f.properties.district}, ${f.properties.subdistrict})`)
    );

    this.set('subdistrictIds', subdistricts.features.map(
      (f) => f.properties.cartodb_id)
    );

    return subdistricts;
  }),
  fetchBluebook: task(function*() {
    yield waitForProperty(this, 'subdistrictPairs');
    return yield carto.SQL(`
      SELECT the_geom, district, subd AS subdistrict
      FROM doe_bluebook_organization_20162017
      WHERE charter != 'Charter'
        AND (district, subd) IN (VALUES ${this.get('subdistrictPairs').join(',')})
    `, 'geojson');
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
      window.map = map;
    },
  }
});
