import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  activeSd: computed('activeSdId', function() {
    return this.get('project.subdistricts').findBy('id', parseInt(this.get('activeSdId')));
  }),

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

  EC_newSchoolsOpened: computed('project.scaProjects.[]', 'activeSchoolsLevel', function() {    
    const schools    = this.get('project.lcgms').filter(
      (b) => (b.district === this.get('activeSd.district') && 
              b.subdistrict === this.get('activeSd.subdistrict') &&
              b.level === this.get('activeSchoolsLevel'))
    ); 

    const enrollment = schools.mapBy('enroll').reduce((a, v) => a + parseInt(v), 0);
    const capacity   = schools.mapBy('capacity').reduce((a, v) => a + parseInt(v), 0);

    return { enrollment, capacity };
  }),

  NA_newResidentialDevelopment: computed('activeSchoolsLevel', 'projects.futureResidentialDev.[]', function() {
    const enrollment = this.get('project.futureResidentialDev')
      .filter((b) => (b.district === this.get('activeSd.district') && b.subdistrict === this.get('activeSd.subdistrict')))
      .mapBy(`${this.get('activeSchoolsLevel')}_students`)
      .reduce((a, v) => a + parseInt(v), 0); 

    return { enrollment }
  }),

  NA_plannedSchools: computed('activeSchoolsLevel', 'projects.scaProjects.[]', function() {
    const capacity = this.get('project.aggregateTotals')
      .find(
        (b) => (
          b.district === this.get('activeSd.district')
          && b.subdistrict === this.get('activeSd.subdistrict')
          && b.level === this.get('activeSchoolsLevel')
        )
      ).get('scaCapacityIncrease');
    
    return { capacity }
  }),

  NA_significantUtilChanges: computed('activeSchoolsLevel', 'projects.scaProjects.[]', function() {
    const capacity = this.get('project.buildings')
      .filter((b) => ('capacityFuture' in b) &&
                     (parseInt(b.capacity) !== parseInt(b.capacityFuture)) &&
                     b.district === this.get('activeSd.district') &&
                     b.subdistrict === this.get('activeSd.subdistrict') &&
                     b.level === this.get('activeSchoolsLevel')
      )
      .reduce((a, v) => a + ((parseInt(v.capacityFuture) - parseInt(v.capacity))), 0);
    
    return { capacity }
  }),

  WA_newSchools: computed('activeSchoolsLevel', 'projects.schoolsWithAction.[]', function() {
    const capacity = this.get('project.schoolsWithAction')
      .filter((b) =>  b.district === this.get('activeSd.district') &&
                      b.subdistrict === this.get('activeSd.subdistrict'))
      .mapBy(`${this.get('activeSchoolsLevel')}_seats`)
      .reduce((a, v) => a + parseInt(v));

    return { capacity }
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
