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
  subdistrictGeojson: computed('analysis.subdistrictCartoIds.[]', function() {    
    return this.fetchSubdistricts.perform();
  }),
  fetchSubdistricts: task(function*() {
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom,
        schooldist AS district,
        zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017
      WHERE cartodb_id IN (${this.analysis.subdistrictCartoIds.join(',')})
    `, 'geojson');
  }).drop(),

  bluebookGeojson: computed('analysis.bluebook.[]', function() {
    return this.fetchBluebookGeojson.perform();
  }),
  fetchBluebookGeojson: task(function*() {
    return yield carto.SQL(`
      SELECT *
      FROM ${this.analysis.dataTables.cartoTables.bluebook}
      WHERE (org_id, bldg_id) IN (VALUES ${this.analysis.bluebookSqlPairs.join(',')})
    `, 'geojson');
  }).drop(),


  lcgmsGeojson: computed('analysis.lcgmsCartoIds.[]', function() {
    if (this.analysis.lcgmsCartoIds.length) {
      return this.fetchLcgmsGeojson.perform();
    } else {
      return this.blankGeojsonPromise();
    }
  }),
  fetchLcgmsGeojson: task(function*() {
    return yield carto.SQL(`
      SELECT the_geom, cartodb_id, name, org_level, cartodb_id, bldg_id, org_id
      FROM ${this.analysis.dataTables.cartoTables.lcgms}
      WHERE cartodb_id IN (${this.analysis.lcgmsCartoIds.join(',')})   
    `, 'geojson');
  }).drop(),


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


  scaProjectsGeojson: computed('analysis.scaProjectsCartoIds.[]', function() {
    if (this.analysis.scaProjectsCartoIds.length) {
      return this.fetchScaProjects.perform();
    } else {
      return this.blankGeojsonPromise();
    }
    
  }),
  fetchScaProjects: task(function*() { 
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom, planned_end_date, name, org_level
      FROM ${this.analysis.dataTables.cartoTables.scaCapitalProjects}
      WHERE cartodb_id IN (${this.analysis.scaProjectsCartoIds.join(',')})
    `, 'geojson')
  }).drop(),


  subwayRoutesGeojson: computed('', function() {
    return this.fetchSubwayRoutes.perform();
  }),
  fetchSubwayRoutes: task(function*() {
    return yield carto.SQL('SELECT the_geom, rt_symbol FROM mta_subway_routes_v0', 'geojson');
  }).drop(),

  subwayStopsGeojson: computed('', function() {
    return this.fetchSubwayStops.perform();
  }),
  fetchSubwayStops: task(function*() {
    return yield carto.SQL('SELECT the_geom, name FROM mta_subway_stops_v0', 'geojson');
  }).drop(),

  subwayEntrancesGeojson: computed('', function() {
    return this.fetchSubwayEntrances.perform();
  }),
  fetchSubwayEntrances: task(function*() {
    return yield carto.SQL('SELECT the_geom FROM mta_subway_entrances_v0', 'geojson');
  }).drop(),


  ceqrTransitZonesMvt: computed('', function() {
    return this.fetchCeqrTransitZones.perform();
  }),
  fetchCeqrTransitZones: task(function*() {
    const url = yield carto.getVectorTileTemplate([{
      id: 'transportation-zones',
      sql: 'SELECT the_geom_webmercator, the_geom, ceqrzone AS zone FROM ceqr_transportation_zones_v2015' }
    ]);

    this.set('ceqrTransitZonesMvtUrl', [url]);
  }).drop(),
});
