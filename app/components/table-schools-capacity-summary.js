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

  activeFutureResidentialDevelopment: computed('activeSchoolsLevel', 'activeSd', 'project.futureResidentialDev.[]', function() {
    if (this.activeSchoolsLevel === 'hs') {
      return this.project.futureResidentialDev
        .map(b => ({
          ...b,
          enrollment: b[`${this.activeSchoolsLevel}_students`]
        }))
    } else {
      return this.project.futureResidentialDev
        .filter((b) => (b.district === this.activeSd.district && b.subdistrict === this.activeSd.subdistrict))
        .map(b => ({
          ...b,
          enrollment: b[`${this.activeSchoolsLevel}_students`]
        }));
    }
  }),

  activeLCMGS: computed('activeSchoolsLevel', 'activeSd', 'project.lcgms.[]', function() {
    if (this.activeSchoolsLevel === 'hs') {
      return this.project.lcgms.filterBy('level', 'hs'); 
    } else {
      return this.project.lcgms.filter(
        (b) => (b.district === this.activeSd.district && 
                b.subdistrict === this.activeSd.subdistrict &&
                b.level === this.activeSchoolsLevel)
      ); 
    }
  }),

  activeScaProjects: computed('activeSchoolsLevel', 'activeSd', 'project.scaProjects.[]', function() {
    const projects = this.project.scaProjects
      .map(b => ({
        ...b,
        capacity: b[`${this.activeSchoolsLevel}_capacity`]
      }));

    if (this.activeSchoolsLevel === 'hs') {
      return projects.filter((b) => b.includeInCapacity && b.capacity > 0);
    } else {
      return projects.filter(
        (b) => 
          b.district === this.activeSd.district
          && b.subdistrict === this.activeSd.subdistrict
          && b.includeInCapacity
          && b.capacity > 0
      );
    }
  }),

  activeBuildings: computed('activeSd', 'activeSchoolsLevel', 'project.buildings.[]', function() {
    const buildings = this.project.buildings.map((b) => ({
      ...b,
      capacityDelta: parseInt(b.capacityFuture) - parseInt(b.capacity)
    }));
    
    if (this.activeSchoolsLevel === 'hs') {
      return buildings.filter(
        (b) => 
          ('capacityFuture' in b)
          && (parseInt(b.capacity) !== parseInt(b.capacityFuture))
          && b.level === 'hs'
      );
    } else {
      return buildings.filter(
        (b) => 
          ('capacityFuture' in b)
          && (parseInt(b.capacity) !== parseInt(b.capacityFuture))
          && b.district === this.activeSd.district
          && b.subdistrict === this.activeSd.subdistrict
          && b.level === this.activeSchoolsLevel
      );
    }
    

  }),

  activeSchoolsWithAction: computed('activeSd', 'activeSchoolsLevel', 'project.schoolsWithAction.[]', function() {
    const schools = this.project.schoolsWithAction
      .map(b => ({
        ...b,
        capacity: parseInt(b[`${this.activeSchoolsLevel}_seats`])
      }))
    
    if (this.activeSchoolsLevel === 'hs') { 
      return schools
    } else {
      return schools.filter(
        (b) => 
          b.district === this.activeSd.district
          && b.subdistrict === this.activeSd.subdistrict
      )
    }
  }),

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

  EC_newSchoolsOpened: computed('activeSd', 'activeSchoolsLevel', 'activeLCGMS', function() {    
    const schools = this.activeLCMGS;

    const enrollment = schools.mapBy('enroll').reduce((a, v) => a + parseInt(v), 0);
    const capacity   = schools.mapBy('capacity').reduce((a, v) => a + parseInt(v), 0);

    return { enrollment, capacity, schools };
  }),

  NA_newResidentialDevelopment: computed('activeSd', 'activeSchoolsLevel', 'activeFutureResidentialDevelopment', function() {
    const developments = this.activeFutureResidentialDevelopment;

    const enrollment = developments
      .mapBy(`${this.activeSchoolsLevel}_students`)
      .reduce((a, v) => a + parseInt(v), 0); 

    return { enrollment, developments }
  }),

  NA_plannedSchools: computed('activeSd', 'activeSchoolsLevel', 'activeScaProjects', function() {    
    const capacity = this.futureConditions.scaCapacityIncrease;
    const schools = this.activeScaProjects;

    return { capacity, schools }
  }),

  NA_significantUtilChanges: computed('activeSd', 'activeSchoolsLevel', 'project.buildings.[]', function() {
    const schools = this.activeBuildings;
    
    const capacityDelta = schools
      .reduce((a, b) => a + b.capacityDelta, 0);

    return { capacityDelta, schools }
  }),

  WA_newSchools: computed('activeSd', 'activeSchoolsLevel', 'project.schoolsWithAction.[]', function() {
    const schools = this.activeSchoolsWithAction;

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
