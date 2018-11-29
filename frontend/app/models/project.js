import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({    
  currentUser: service(),
  
  editors: DS.hasMany('user', { inverse: 'editable_projects' }),
  viewers: DS.hasMany('user', { inverse: 'viewable_projects' }),
  projectPermissions: DS.hasMany('project-permissions'),

  viewOnly: DS.attr('boolean'),

  created_at: DS.attr('string'),
  updated_at: DS.attr('string'),
  updated_by: DS.attr('string'),

  name: DS.attr('string'),
  buildYear: DS.attr('number'),
  bbls: DS.attr('', { defaultValue() { return []; } }),
  ceqrNumber: DS.attr('string'),
  borough: DS.attr('string', { defaultValue: 'Bronx' }),
  boroCode: computed('borough', function() {
    switch (this.get('borough')) {
      case 'Manhattan': return 1;
      case 'Bronx': return 2;
      case 'Brooklyn': return 3;
      case 'Queens': return 4;
      case 'Staten Island': return 5;
      default: return null;
    }
  }),

  // Analysis Framework
  totalUnits: DS.attr('number', { defaultValue: 0 }),
  seniorUnits: DS.attr('number', { defaultValue: 0 }),
  netUnits: computed('totalUnits', 'seniorUnits', function() {
    return this.get('totalUnits') - this.get('seniorUnits');
  }),

  // TODO: split out into other relationships

  // - Tranpsortation -
  trafficZone: DS.attr('number'),

  publicSchoolsAnalysis: DS.belongsTo('public-schools-analysis')
});
