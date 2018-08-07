import Service from '@ember/service';
import { task } from 'ember-concurrency';
import carto from 'carto-promises-utility/utils/carto';

export default Service.extend({
  project: null,

  initialLoad: task(function*() {
    const trafficZones = yield carto.SQL(`
      SELECT DISTINCT
        traffic_zones.ceqrzone
      FROM ceqr_transportation_zones_v2015 AS traffic_zones, (
        SELECT the_geom, bbl
        FROM mappluto_v1711
        WHERE bbl IN (${this.get('project.bbls').join(',')})
      ) pluto
      WHERE ST_Intersects(pluto.the_geom, traffic_zones.the_geom)
    `)

    this.set('project.trafficZone', trafficZones[0].ceqrzone)
  })
});
