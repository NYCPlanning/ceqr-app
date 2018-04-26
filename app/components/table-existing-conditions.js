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

  // Found online: http://www.jacklmoore.com/notes/rounding-in-javascript/
  round: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  },

  // Totals
  psEnrollment: computed.mapBy('psBuildings.value', 'enroll'),
  psSeats: computed.mapBy('psBuildings.value', 'seats'),
  psCapacity: computed.mapBy('psBuildings.value', 'capacity'),
  msEnrollment: computed.mapBy('msBuildings.value', 'enroll'),
  msSeats: computed.mapBy('msBuildings.value', 'seats'),
  msCapacity: computed.mapBy('msBuildings.value', 'capacity'),

  psEnrollmentTotal: computed.sum('psEnrollment'),
  psCapacityTotal: computed.sum('psCapacity'),
  psSeatsTotal: computed.sum('psSeats'),
  psUtilization: computed('psEnrollmentTotal', 'psCapacityTotal', function() {
    return this.round(this.get('psEnrollmentTotal') / this.get('psCapacityTotal'), 3);
  }),

  msEnrollmentTotal: computed.sum('msEnrollment'),
  msCapacityTotal: computed.sum('msCapacity'),
  msSeatsTotal: computed.sum('msSeats'),
  msUtilization: computed('msEnrollmentTotal', 'msCapacityTotal', function() {
    return this.round(this.get('msEnrollmentTotal') / this.get('msCapacityTotal'), 3);
  }),

  // Ember concurrency tasks
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
