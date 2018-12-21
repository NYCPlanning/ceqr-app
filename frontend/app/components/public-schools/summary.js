import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  activeSchoolsLevel: 'ps',
  activeSdId: null,
  activeSd: computed('activeSdId', function() {
    return this.analysis.subdistricts.findBy('id', parseInt(this.activeSdId));
  }),

  EC_active: false,
  NA_resdev: false,
  NA_schools: false,
  NA_utilchange: false,
  WA_schools: false,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('activeSdId', (this.analysis.subdistricts[0].id).toString());
  },

  activeFutureResidentialDevelopment: computed(
    'activeSchoolsLevel',
    'activeSd',
    'analysis.{dataVersion,futureResidentialDev.@each}',
    
    function() {      
      if (this.activeSchoolsLevel === 'hs') {
        return this.analysis.futureResidentialDev
          .map(b => {
            b.set('enrollment', b.get(`${this.activeSchoolsLevel}_students`));
            return b;
          });
      } else {
        return this.analysis.futureResidentialDev
          .filter((b) => (b.district === this.activeSd.district && b.subdistrict === this.activeSd.subdistrict))
          .map(b => {
            b.set('enrollment', b.get(`${this.activeSchoolsLevel}_students`));
            return b;
          });
      }
    }
  ),

  activeLCMGS: computed(
    'activeSchoolsLevel',
    'activeSd',
    'analysis.{dataVersion,lcgms.[]}',
    
    function() {
      if (this.activeSchoolsLevel === 'hs') {
        return this.analysis.lcgms.filterBy('level', 'hs'); 
      } else {
        return this.analysis.lcgms.filter(
          (b) => (b.district === this.activeSd.district && 
                  b.subdistrict === this.activeSd.subdistrict &&
                  b.level === this.activeSchoolsLevel)
        ); 
      }
    }
  ),

  activeScaProjects: computed(
    'activeSchoolsLevel',
    'activeSd',
    'analysis.{dataVersion,scaProjects.[]}',
    
    function() {
      const projects = this.analysis.scaProjects
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
    }
  ),

  activeBuildings: computed(
    'activeSd',
    'activeSchoolsLevel',
    'analysis.{dataVersion,buildings.[]}',
    
    function() {
      const buildings = this.analysis.buildings.map((b) => ({
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
    }
  ),

  activeSchoolsWithAction: computed(
    'activeSd',
    'activeSchoolsLevel',
    'analysis.{dataVersion,schoolsWithAction.[]}',
    
    function() {
      const schools = this.analysis.schoolsWithAction
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
    }
  ),

  existingConditions: computed(
    'activeSdId',
    'activeSchoolsLevel',
    'analysis.dataVersion',
    
    function() {
      if (this.activeSchoolsLevel === 'hs') {
        return this.analysis.schoolTotals.findBy('level', 'hs');
      } else {
        return this.analysis.schoolTotals.find(
          (total) => (total.id === parseInt(this.activeSdId) && total.level === this.activeSchoolsLevel)
        );
      }
    }
  ),

  futureConditions: computed(
    'activeSdId',
    'activeSchoolsLevel',
    'analysis.dataVersion',
    
    function() {
      if (this.activeSchoolsLevel === 'hs') {
        return this.analysis.aggregateTotals.findBy('level', 'hs');
      } else {
        return this.analysis.aggregateTotals.find(
          (total) => (total.id === parseInt(this.activeSdId) && total.level === this.activeSchoolsLevel)
        );
      }
    }
  ),

  EC_newSchoolsOpened: computed('activeSd', 'activeSchoolsLevel', 'activeLCGMS', function() {    
    const schools = this.activeLCMGS;

    const enrollment = schools.mapBy('enroll').reduce((a, v) => a + parseInt(v), 0);
    const capacity   = schools.mapBy('capacity').reduce((a, v) => a + parseInt(v), 0);

    return { enrollment, capacity, schools };
  }),

  NA_newResidentialDevelopment: computed('activeSd', 'activeSchoolsLevel', 'activeFutureResidentialDevelopment.[]', function() {
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

  NA_significantUtilChanges: computed('activeSd', 'activeSchoolsLevel', 'analysis.buildings.[]', function() {
    const schools = this.activeBuildings;
    
    const capacityDelta = schools
      .reduce((a, b) => a + b.capacityDelta, 0);

    return { capacityDelta, schools }
  }),

  WA_newSchools: computed('activeSd', 'activeSchoolsLevel', 'analysis.schoolsWithAction.[]', function() {
    const schools = this.activeSchoolsWithAction;

    const capacity = schools
      .mapBy('capacity')
      .reduce((a, v) => a + parseInt(v), 0);

    return { capacity, schools }
  }),

  sd: computed('activeSdId', function() {
    return this.analysis.subdistricts.findBy('id', parseInt(this.activeSdId));
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
