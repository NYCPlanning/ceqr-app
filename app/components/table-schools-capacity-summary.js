import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('activeSdId', (this.get('project.subdistricts')[0].id).toString());
  },

  existingConditions: computed('activeSdId', 'activeSchoolsLevel', function() {
    if (this.get('activeSchoolsLevel') === 'hs') {
      return this.get('project.schoolTotals').findBy('level', 'hs');
    } else {
      return this.get('project.schoolTotals').find(
        (total) => (total.id === parseInt(this.get('activeSdId')) && total.level === this.get('activeSchoolsLevel'))
      );
    }
  }),

  futureConditions: computed('activeSdId', 'activeSchoolsLevel', function() {
    if (this.get('activeSchoolsLevel') === 'hs') {
      return this.get('project.aggregateTotals').findBy('level', 'hs');
    } else {
      return this.get('project.aggregateTotals').find(
        (total) => (total.id === parseInt(this.get('activeSdId')) && total.level === this.get('activeSchoolsLevel'))
      );
    }
  }),

  sd: computed('activeSdId', function() {
    return this.get('project.subdistricts').findBy('id', parseInt(this.get('activeSdId')));
  }),

  actions: {
    setSdId: function(sdId) {
      this.set('activeSdId', sdId);
    }
  }
});
