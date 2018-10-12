import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  activeSd: computed('activeSdId', function() {
    return this.project.subdistricts.findBy('id', parseInt(this.activeSdId));
  }),

  EC_active: false,
  NA_resdev: false,
  NA_schools: false,
  NA_utilchange: false,
  WA_schools: false,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('activeSdId', (this.project.subdistricts[0].id).toString());
  },

  existingConditions: computed('activeSdId', 'activeSchoolsLevel', function() {
    if (this.activeSchoolsLevel === 'hs') {
      return this.project.schoolTotals.findBy('level', 'hs');
    } else {
      return this.project.schoolTotals.find(
        (total) => (total.id === parseInt(this.activeSdId) && total.level === this.activeSchoolsLevel)
      );
    }
  }),

  futureConditions: computed('activeSdId', 'activeSchoolsLevel', function() {
    if (this.activeSchoolsLevel === 'hs') {
      return this.project.aggregateTotals.findBy('level', 'hs');
    } else {
      return this.project.aggregateTotals.find(
        (total) => (total.id === parseInt(this.activeSdId) && total.level === this.activeSchoolsLevel)
      );
    }
  }),

  EC_newSchoolsOpened: computed('activeSd', 'activeSchoolsLevel', 'project.scaProjects.[]', function() {    
    const schools    = this.project.lcgms.filter(
      (b) => (b.district === this.activeSd.district && 
              b.subdistrict === this.activeSd.subdistrict &&
              b.level === this.activeSchoolsLevel)
    ); 

    const enrollment = schools.mapBy('enroll').reduce((a, v) => a + parseInt(v), 0);
    const capacity   = schools.mapBy('capacity').reduce((a, v) => a + parseInt(v), 0);

    return { enrollment, capacity, schools };
  }),

  NA_newResidentialDevelopment: computed('activeSd', 'activeSchoolsLevel', 'project.futureResidentialDev.[]', function() {
    const developments = this.project.futureResidentialDev
      .filter((b) => (b.district === this.activeSd.district && b.subdistrict === this.activeSd.subdistrict))
      .map(b => ({
        ...b,
        enrollment: b[`${this.activeSchoolsLevel}_students`]
      }));

    const enrollment = developments
      .mapBy(`${this.activeSchoolsLevel}_students`)
      .reduce((a, v) => a + parseInt(v), 0); 

    return { enrollment, developments }
  }),

  NA_plannedSchools: computed('activeSd', 'activeSchoolsLevel', 'project.scaProjects.[]', function() {    
    const capacity = this.futureConditions.scaCapacityIncrease;
    
    const schools = this.project.scaProjects
      .map(b => ({
        ...b,
        capacity: b[`${this.activeSchoolsLevel}_capacity`]
      }))
      .filter(
        (b) => 
          b.district === this.activeSd.district
          && b.subdistrict === this.activeSd.subdistrict
          && b.includeInCapacity
          && b.capacity > 0
      );

    return { capacity, schools }
  }),

  NA_significantUtilChanges: computed('activeSd', 'activeSchoolsLevel', 'project.scaProjects.[]', function() {
    const schools = this.project.buildings
      .filter(
        (b) => 
          ('capacityFuture' in b)
          && (parseInt(b.capacity) !== parseInt(b.capacityFuture))
          && b.district === this.activeSd.district
          && b.subdistrict === this.activeSd.subdistrict
          && b.level === this.activeSchoolsLevel
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
    const schools = this.project.schoolsWithAction
      .map(b => ({
        ...b,
        capacity: parseInt(b[`${this.activeSchoolsLevel}_seats`])
      }))
      .filter(
        (b) => 
          b.district === this.activeSd.district
          && b.subdistrict === this.activeSd.subdistrict
      )

    const capacity = schools
      .mapBy('capacity')
      .reduce((a, v) => a + parseInt(v), 0);

    return { capacity, schools }
  }),

  sd: computed('activeSdId', function() {
    return this.project.subdistricts.findBy('id', parseInt(this.activeSdId));
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
