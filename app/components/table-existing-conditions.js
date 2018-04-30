import Component from '@ember/component';
import carto from 'carto-promises-utility/utils/carto';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  analysis: service(),

  // Found online: http://www.jacklmoore.com/notes/rounding-in-javascript/
  round: function(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  },

  // Totals
  _psEnrollment: computed.mapBy('analysis.psBuildings.value', 'enroll'),
  _psSeats: computed.mapBy('analysis.psBuildings.value', 'seats'),
  _psCapacity: computed.mapBy('analysis.psBuildings.value', 'capacity'),
  _msEnrollment: computed.mapBy('analysis.msBuildings.value', 'enroll'),
  _msSeats: computed.mapBy('analysis.msBuildings.value', 'seats'),
  _msCapacity: computed.mapBy('analysis.msBuildings.value', 'capacity'),

  psEnrollmentTotal: computed.sum('_psEnrollment'),
  psCapacityTotal: computed.sum('_psCapacity'),
  psSeatsTotal: computed.sum('_psSeats'),
  psUtilization: computed('psEnrollmentTotal', 'psCapacityTotal', function() {
    return this.round(this.get('psEnrollmentTotal') / this.get('psCapacityTotal'), 3);
  }),

  msEnrollmentTotal: computed.sum('_msEnrollment'),
  msCapacityTotal: computed.sum('_msCapacity'),
  msSeatsTotal: computed.sum('_msSeats'),
  msUtilization: computed('msEnrollmentTotal', 'msCapacityTotal', function() {
    return this.round(this.get('msEnrollmentTotal') / this.get('msCapacityTotal'), 3);
  }),
});
