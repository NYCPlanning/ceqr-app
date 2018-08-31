import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  activeSd: computed('activeSdId', function() {
    return this.get('project.subdistricts').findBy('id', parseInt(this.get('activeSdId')));
  }),

  EC_active: false,
  NA_resdev: false,
  NA_schools: false,
  NA_utilchange: false,
  WA_schools: false,

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

  EC_newSchoolsOpened: computed('activeSd', 'activeSchoolsLevel', 'project.scaProjects.[]', function() {    
    const schools    = this.get('project.lcgms').filter(
      (b) => (b.district === this.get('activeSd.district') && 
              b.subdistrict === this.get('activeSd.subdistrict') &&
              b.level === this.get('activeSchoolsLevel'))
    ); 

    const enrollment = schools.mapBy('enroll').reduce((a, v) => a + parseInt(v), 0);
    const capacity   = schools.mapBy('capacity').reduce((a, v) => a + parseInt(v), 0);

    return { enrollment, capacity, schools };
  }),

  NA_newResidentialDevelopment: computed('activeSd', 'activeSchoolsLevel', 'project.futureResidentialDev.[]', function() {
    const developments = this.get('project.futureResidentialDev')
      .filter((b) => (b.district === this.get('activeSd.district') && b.subdistrict === this.get('activeSd.subdistrict')))
      .map(b => ({
        ...b,
        enrollment: b[`${this.get('activeSchoolsLevel')}_students`]
      }));

    const enrollment = developments
      .mapBy(`${this.get('activeSchoolsLevel')}_students`)
      .reduce((a, v) => a + parseInt(v), 0); 

    return { enrollment, developments }
  }),

  NA_plannedSchools: computed('activeSd', 'activeSchoolsLevel', 'project.scaProjects.[]', function() {
    const capacity = this.get('project.aggregateTotals')
      .find(
        (b) => (
          b.district === this.get('activeSd.district')
          && b.subdistrict === this.get('activeSd.subdistrict')
          && b.level === this.get('activeSchoolsLevel')
        )
      ).get('scaCapacityIncrease');
    
    const schools = this.get('project.scaProjects')
      .map(b => ({
        ...b,
        capacity: b[`${this.get('activeSchoolsLevel')}_capacity`]
      }))
      .filter(
        (b) => 
          b.district === this.get('activeSd.district')
          && b.subdistrict === this.get('activeSd.subdistrict')
          && b.includeInCapacity
          && b.capacity > 0
      );

    return { capacity, schools }
  }),

  NA_significantUtilChanges: computed('activeSd', 'activeSchoolsLevel', 'project.scaProjects.[]', function() {
    const schools = this.get('project.buildings')
      .filter(
        (b) => 
          ('capacityFuture' in b)
          && (parseInt(b.capacity) !== parseInt(b.capacityFuture))
          && b.district === this.get('activeSd.district')
          && b.subdistrict === this.get('activeSd.subdistrict')
          && b.level === this.get('activeSchoolsLevel')
      )
      .map((b) => ({
        ...b,
        capacityDelta: parseInt(b.capacityFuture) - parseInt(b.capacity)
      }));
    
    const capacityDelta = schools
      .reduce((a, b) => a + b.capacityDelta, 0);

    return { capacityDelta, schools }
  }),

  WA_newSchools: computed('activeSd', 'activeSchoolsLevel', 'project.schoolsWithAction.[]', function() {
    const schools = this.get('project.schoolsWithAction')
      .map(b => ({
        ...b,
        capacity: parseInt(b[`${this.get('activeSchoolsLevel')}_seats`])
      }))
      .filter(
        (b) => 
          b.district === this.get('activeSd.district')
          && b.subdistrict === this.get('activeSd.subdistrict')
      )

    const capacity = schools
      .mapBy('capacity')
      .reduce((a, v) => a + parseInt(v), 0);

    return { capacity, schools }
  }),

  sd: computed('activeSdId', function() {
    return this.get('project.subdistricts').findBy('id', parseInt(this.get('activeSdId')));
  }),

  actions: {
    setSdId: function(sdId) {
      this.set('activeSdId', sdId);
    },

    toggle: function(prop) {
      this.toggleProperty(prop);
    },
  }
});
