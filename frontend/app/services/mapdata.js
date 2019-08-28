import Service from '@ember/service';
import { computed } from '@ember/object';
import carto from 'carto-promises-utility/utils/carto';
import { task } from 'ember-concurrency';

export default Service.extend({
  project: null,

  blankGeojsonPromise() {
    return new Promise(function(resolve) {
      resolve({
        type: "FeatureCollection",
        features: [],
      })
    })
  },

  // Geojson

  psZonesGeojson: computed('project.boroCode', function() {    
    return this.fetchPsZones.perform();
  }),
  fetchPsZones: task(function*() {
    return yield carto.SQL(`
      SELECT eszones.the_geom, eszones.remarks, eszones.dbn, eszones.esid_no AS id  
      FROM support_school_zones_es AS eszones
      WHERE borocode = ${this.project.boroCode}
    `, 'geojson')
  }).drop(),


  isZonesGeojson: computed('project.boroCode', function() {
    return this.fetchIsZones.perform();
  }),
  fetchIsZones: task(function*() {
    return yield carto.SQL(`
      SELECT mszones.the_geom, mszones.remarks, mszones.dbn, mszones.msid_no AS id  
      FROM support_school_zones_ms AS mszones
      WHERE borocode = ${this.project.boroCode}
    `, 'geojson')
  }).drop(),


  hsZonesGeojson: computed('project.boroCode', function() {
    return this.fetchHsZones.perform();
  }),
  fetchHsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT hszones.the_geom, hszones.remarks, hszones.dbn, hszones.hsid_no AS id  
      FROM support_school_zones_hs AS hszones
      WHERE boro = ${this.project.boroCode}
    `, 'geojson')
  }).drop(),

});
