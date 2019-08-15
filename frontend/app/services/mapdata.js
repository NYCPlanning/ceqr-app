import Service from '@ember/service';
import { computed } from '@ember/object';
import carto from 'carto-promises-utility/utils/carto';
import { task } from 'ember-concurrency';

export default Service.extend({
  project: null,
  analysis: null,

  blankGeojsonPromise() {
    return new Promise(function(resolve) {
      resolve({
        type: "FeatureCollection",
        features: [],
      })
    })
  },

  // Geojson

  esZonesGeojson: computed('analysis.subdistrictCartoIds.[]', function() {
    return this.fetchEsZones.perform();
  }),
  fetchEsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT eszones.the_geom, eszones.remarks, eszones.dbn, eszones.esid_no AS id  
      FROM ${this.analysis.dataTables.cartoTables.esSchoolZones} AS eszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.analysis.subdistrictCartoIds.join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, eszones.the_geom)
    `, 'geojson')
  }).drop(),


  isZonesGeojson: computed('analysis.subdistrictCartoIds.[]', function() {
    return this.fetchIsZones.perform();
  }),
  fetchIsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT mszones.the_geom, mszones.remarks, mszones.dbn, mszones.msid_no AS id  
      FROM ${this.analysis.dataTables.cartoTables.msSchoolZones} AS mszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.analysis.subdistrictCartoIds.join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, mszones.the_geom)
    `, 'geojson')
  }).drop(),


  hsZonesGeojson: computed('analysis.subdistrictCartoIds.[]', function() {
    return this.fetchHsZones.perform();
  }),
  fetchHsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT hszones.the_geom, hszones.remarks, hszones.dbn, hszones.hsid_no AS id  
      FROM ${this.analysis.dataTables.cartoTables.hsSchoolZones} AS hszones
      WHERE boro = ${this.project.boroCode}
    `, 'geojson')
  }).drop(),

});
