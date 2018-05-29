import Service from '@ember/service';
import { computed } from '@ember/object';
import carto from 'carto-promises-utility/utils/carto';
import { task } from 'ember-concurrency';

export default Service.extend({
  project: null,
  
  setProject(project) {
    this.set('project', project);
  },

  // Geojson
  bblGeojson: computed('project.bbls.[]', function() {
    return this.get('fetchBbls').perform();
  }),
  fetchBbls: task(function*() {
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom, bbl
      FROM mappluto_v1711
      WHERE bbl IN (${this.get('project.bbls').join(',')})
    `, 'geojson');
  }).drop(),


  subdistrictGeojson: computed('project.subdistrictCartoIds.[]', function() {
    return this.get('fetchSubdistricts').perform();
  }),
  fetchSubdistricts: task(function*() {
    return yield carto.SQL(`
      SELECT cartodb_id, the_geom,
        schooldist AS district,
        zone AS subdistrict
      FROM doe_schoolsubdistricts_v2017
      WHERE cartodb_id IN (${this.get('project.subdistrictCartoIds').join(',')})
    `, 'geojson');
  }).drop(),

  bluebookGeojson: computed('project.bluebookCartoIds.[]', function() {
    return this.get('fetchBluebookGeojson').perform();
  }),
  fetchBluebookGeojson: task(function*() {
    return yield carto.SQL(`
      SELECT the_geom, district, subd AS subdistrict, cartodb_id
      FROM doe_bluebook_v1617
      WHERE cartodb_id IN (${this.get('project.bluebookCartoIds').join(',')})
    `, 'geojson');
  }).drop(),


  lcgmsGeojson: computed('project.lcgmsCartoIds.[]', function() {
    return this.get('fetchLcgmsGeojson').perform();
  }),
  fetchLcgmsGeojson: task(function*() {
    return yield carto.SQL(`
      SELECT the_geom, open_date, location_name AS name, grades
      FROM doe_lcgms_v201718
      WHERE cartodb_id IN (${this.get('project.lcgmsCartoIds').join(',')})   
    `, 'geojson');
  }).drop(),


  esZonesGeojson: computed('project.subdistrictCartoIds.[]', function() {
    return this.get('fetchEsZones').perform();
  }),
  fetchEsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT eszones.the_geom, eszones.remarks, eszones.esid_no AS id  
      FROM support_school_zones_es AS eszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('project.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, eszones.the_geom)
    `, 'geojson')
  }).drop(),


  isZonesGeojson: computed('project.subdistrictCartoIds.[]', function() {
    return this.get('fetchIsZones').perform();
  }),
  fetchIsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT mszones.the_geom, mszones.remarks, mszones.msid_no AS id  
      FROM support_school_zones_ms AS mszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('project.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, mszones.the_geom)
    `, 'geojson')
  }).drop(),


  hsZonesGeojson: computed('project.subdistrictCartoIds.[]', function() {
    return this.get('fetchHsZones').perform();
  }),
  fetchHsZones: task(function*() {
    return yield carto.SQL(`
      SELECT DISTINCT hszones.the_geom, hszones.remarks, hszones.hsid_no AS id  
      FROM support_school_zones_hs AS hszones, (
        SELECT the_geom
        FROM doe_schoolsubdistricts_v2017
        WHERE cartodb_id IN (${this.get('project.subdistrictCartoIds').join(',')})
      ) subdistricts
      WHERE ST_Intersects(subdistricts.the_geom, hszones.the_geom)
    `, 'geojson')
  }).drop(),


  scaProjectsGeojson: computed('project.scaProjectsCartoIds.[]', function() {
    return this.get('fetchScaProjects').perform();
  }),
  fetchScaProjects: task(function*() { 
    return yield carto.SQL(`
      SELECT the_geom, bbl, school
      FROM sca_project_sites_v03222018
      WHERE cartodb_id IN (${this.get('project.scaProjectsCartoIds').join(',')})
    `, 'geojson')
  }).drop(),
  
});
