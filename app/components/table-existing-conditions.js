import Component from '@ember/component';
import carto from 'carto-promises-utility/utils/carto';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

export default Component.extend({
  psBuildings: computed('schoolIds', function() {
    return this.get('fetchPsBuildings').perform();
  }),
  msBuildings: computed('schoolIds', function() {
    return this.get('fetchMsBuildings').perform();
  }),
  // hsBuildings: computed('schoolIds', function() {
  //   return this.get('fetchHsBuildings').perform();
  // }),

  fetchPsBuildings: task(function*() {
    yield waitForProperty(this, 'schoolIds');
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
      WHERE cartodb_id IN (${this.get('schoolIds').join(',')})
        AND org_level like '%25PS%25'
    `);
  }),
  fetchMsBuildings: task(function*() {
    yield waitForProperty(this, 'schoolIds');
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
      WHERE cartodb_id IN (${this.get('schoolIds').join(',')})
        AND org_level like '%25IS%25'
    `);
  }),
});
