import Service from '@ember/service';
import { computed } from '@ember/object';
import carto from 'carto-promises-utility/utils/carto';
import { task } from 'ember-concurrency';

export default Service.extend({
  project: null,
  analysis: null,

  blankGeojsonPromise: new Promise(function(resolve) {
    resolve({
      type: "FeatureCollection",
      features: [],
    })
  }),

  // Geojson
  bblGeojson: computed('analysis.bbls.[]', function() {
    return this.get('fetchBbls').perform();
  }),
  fetchBbls: task(function*() {
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom, bbl
      FROM mappluto_v1711
      WHERE bbl IN (${this.get('analysis.bbls').join(',')})
    `, 'geojson');
  }).drop(),


  subdistrictGeojson: computed('analysis.subdistrictCartoIds.[]', function() {    
    return this.get('fetchSubdistricts').perform();
  }),
  fetchSubdistricts: task(function*() {
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom,
        schooldist AS district,
        zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017
      WHERE cartodb_id IN (${this.get('analysis.subdistrictCartoIds').join(',')})
    `, 'geojson');
  }).drop(),

  bluebookGeojson: computed('analysis.bluebook.[]', function() {
    return this.get('fetchBluebookGeojson').perform();
  }),
  fetchBluebookGeojson: task(function*() {
    return yield carto.SQL(`
      SELECT *
      FROM ceqr_bluebook_v2017
      WHERE (org_id, bldg_id) IN (VALUES ${this.get('analysis.bluebookSqlPairs').join(',')})
    `, 'geojson');
  }).drop(),


  lcgmsGeojson: computed('analysis.lcgmsCartoIds.[]', function() {
    if (this.analysis.lcgmsCartoIds.length) {
      return this.get('fetchLcgmsGeojson').perform();
    } else {
      return this.blankGeojsonPromise;
    }
  }),
  fetchLcgmsGeojson: task(function*() {
    return yield carto.SQL(`
      SELECT the_geom, cartodb_id, name, org_level, cartodb_id, bldg_id, org_id
      FROM ceqr_lcgms_v2017
      WHERE cartodb_id IN (${this.get('analysis.lcgmsCartoIds').join(',')})   
    `, 'geojson');
  }).drop(),


  esZonesGeojson: computed('analysis.subdistrictCartoIds.[]', function() {
    return this.get('fetchEsZones').perform();
  }),
  fetchEsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT eszones.the_geom, eszones.remarks, eszones.dbn, eszones.esid_no AS id  
      FROM support_school_zones_es AS eszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('analysis.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, eszones.the_geom)
    `, 'geojson')
  }).drop(),


  isZonesGeojson: computed('analysis.subdistrictCartoIds.[]', function() {
    return this.get('fetchIsZones').perform();
  }),
  fetchIsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT mszones.the_geom, mszones.remarks, mszones.dbn, mszones.msid_no AS id  
      FROM support_school_zones_ms AS mszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('analysis.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, mszones.the_geom)
    `, 'geojson')
  }).drop(),


  hsZonesGeojson: computed('analysis.subdistrictCartoIds.[]', function() {
    return this.get('fetchHsZones').perform();
  }),
  fetchHsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT hszones.the_geom, hszones.remarks, hszones.dbn, hszones.hsid_no AS id  
      FROM support_school_zones_hs AS hszones
      WHERE boro = ${this.get('project.boroCode')}
    `, 'geojson')
  }).drop(),


  scaProjectsGeojson: computed('analysis.scaProjectsCartoIds.[]', function() {
    if (this.analysis.scaProjectsCartoIds.length) {
      return this.get('fetchScaProjects').perform();
    } else {
      return this.blankGeojsonPromise;
    }
    
  }),
  fetchScaProjects: task(function*() { 
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom, planned_end_date, name, org_level
      FROM sca_capital_projects_v102018
      WHERE cartodb_id IN (${this.get('analysis.scaProjectsCartoIds').join(',')})
    `, 'geojson')
  }).drop(),


  subwayRoutesGeojson: computed('', function() {
    return this.get('fetchSubwayRoutes').perform();
  }),
  fetchSubwayRoutes: task(function*() {
    return yield carto.SQL('SELECT the_geom, rt_symbol FROM mta_subway_routes_v0', 'geojson');
  }).drop(),

  subwayStopsGeojson: computed('', function() {
    return this.get('fetchSubwayStops').perform();
  }),
  fetchSubwayStops: task(function*() {
    return yield carto.SQL('SELECT the_geom, name FROM mta_subway_stops_v0', 'geojson');
  }).drop(),

  subwayEntrancesGeojson: computed('', function() {
    return this.get('fetchSubwayEntrances').perform();
  }),
  fetchSubwayEntrances: task(function*() {
    return yield carto.SQL('SELECT the_geom FROM mta_subway_entrances_v0', 'geojson');
  }).drop(),

  transportationZonesMvt: null,
  fetchTransportationZones: computed('', function() {
    return carto.getVectorTileTemplate([{
      id: 'transportation-zones',
      sql: 'SELECT the_geom_webmercator, the_geom, ceqrzone FROM ceqr_transportation_zones_v2015' }
    ]).then((url) => this.set('transportationZonesMvt', url));
  }),
});
