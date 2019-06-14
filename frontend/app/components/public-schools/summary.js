import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  activeSchoolsLevel: 'ps',

  EC_active: false,
  NA_resdev: false,
  NA_schools: false,
  NA_utilchange: false,
  WA_schools: false,

  levelTotals: computed('activeSchoolsLevel', function() {
    switch (this.activeSchoolsLevel) {
      case 'ps': return this.analysis.psLevelTotals;
      case 'is': return this.analysis.isLevelTotals;
      case 'hs': return this.analysis.hsLevelTotals;
    }
  }),

  EC_newSchoolsOpened: computed('activeSchoolsLevel', 'analysis.lcmgs', function() {    
    const schools = this.analysis.lcgms.filterBy('level', this.activeSchoolsLevel);

    const enrollment = schools.mapBy('enroll').reduce((a, v) => a + parseInt(v), 0);
    const capacity   = schools.mapBy('capacity').reduce((a, v) => a + parseInt(v), 0);

    return { enrollment, capacity, schools };
  }),

  NA_newResidentialDevelopment: computed('activeSchoolsLevel', function() {
    const developments = this.analysis.futureResidentialDev.map(b => {
      b.set('enrollment', b.get(`${this.activeSchoolsLevel}_students`));
      return b;
    });

    const enrollment = developments
      .mapBy(`${this.activeSchoolsLevel}_students`)
      .reduce((a, v) => a + parseInt(v), 0);      

    return { enrollment, developments }
  }),

  NA_plannedSchools: computed('activeSchoolsLevel', 'levelTotals', function() {    
    const capacity = this.levelTotals.scaCapacityIncrease;

    const schools = this.analysis.scaProjects
      .map(b => ({
        ...b,
        capacity: b[`${this.activeSchoolsLevel}_capacity`]
      }))
      .filter((b) => b.includeInCapacity && b.capacity > 0);

    return { capacity, schools }
  }),

  NA_significantUtilChanges: computed('activeSchoolsLevel', 'analysis.buildings.[]', function() {
    const schools = this.analysis.buildings
      .map((b) => ({
        ...b,
        capacityDelta: parseInt(b.capacityFuture) - parseInt(b.capacity)
      }))
      .filter(
        (b) => 
          ('capacityFuture' in b)
          && (parseInt(b.capacity) !== parseInt(b.capacityFuture))
          && b.level === this.activeSchoolsLevel
      );
    
    const capacityDelta = schools
      .reduce((a, b) => a + b.capacityDelta, 0);

    return { capacityDelta, schools }
  }),

  WA_newSchools: computed('activeSchoolsLevel', 'analysis.schoolsWithAction.[]', function() {
    const schools = this.analysis.schoolsWithAction
      .map(b => ({
        ...b,
        capacity: parseInt(b[`${this.activeSchoolsLevel}_seats`])
      }));

    const capacity = schools
      .mapBy('capacity')
      .reduce((a, v) => a + parseInt(v), 0);

    return { capacity, schools }
  }),

  actions: {
    toggle: function(prop) {
      this.toggleProperty(prop);
    },
  }
});
