import Component from '@ember/component';
import { computed } from '@ember/object';
import mapColors from '../../../utils/mapColors';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  mapColors,

  styleFor(level) {
    return mapColors.styleFor(level);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    const { analysis } = this;

    if (analysis) {
      this.set('activeSdId', analysis.subdistricts[0].id);
    }
  },

  scaBluebookMetadata: computed('analysis.dataPackage.schemas.ceqr_school_buildings.sources', function() {
    return this.analysis.dataPackage.schemas.ceqr_school_buildings.sources.find((source) => source.name === 'bluebook');
  }),

  table: computed('activeSdId', 'activeSchoolsLevel', function() {
    if (this.activeSchoolsLevel === 'hs') {
      return this.analysis.subdistrictTotals.findBy('level', 'hs');
    }
    return this.analysis.subdistrictTotals.find(
      (total) => (parseFloat(total.id) === parseFloat(this.activeSdId) && total.level === this.activeSchoolsLevel),
    );
  }),

  buildings: computed('table', function() {
    return this.table.buildings.sortBy('org_id');
  }),

  sd: computed('activeSdId', function() {
    return this.analysis.subdistricts.findBy('id', this.activeSdId);
  }),

  actions: {
    setSdId(sdId) {
      this.set('activeSdId', sdId);
    },
  },
});
