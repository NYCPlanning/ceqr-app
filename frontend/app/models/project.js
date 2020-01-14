import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import boroughToAbbr from 'labs-ceqr/utils/boroughToAbbr';

export default DS.Model.extend({
  currentUser: service(),

  editors: DS.hasMany('user', { inverse: 'editable_projects' }),
  viewers: DS.hasMany('user', { inverse: 'viewable_projects' }),
  projectPermissions: DS.hasMany('project-permissions'),

  dataPackage: DS.belongsTo('dataPackage'),

  viewOnly: DS.attr('boolean'),

  created_at: DS.attr('string'),
  updated_at: DS.attr('string'),
  updated_by: DS.attr('string'),

  name: DS.attr('string'),
  buildYear: DS.attr('number'),
  ceqrNumber: DS.attr('string'),

  bbls: DS.attr('', { defaultValue() { return []; } }),
  bblsVersion: DS.attr('string'),
  bblsGeojson: DS.attr(''),

  borough: computed('boroCode', function() {
    switch (this.boroCode) {
      case 1: return 'Manhattan';
      case 2: return 'Bronx';
      case 3: return 'Brooklyn';
      case 4: return 'Queens';
      case 5: return 'Staten Island';
      default: return null;
    }
  }),
  boroCode: computed('bbls.[]', function() {
    if (this.bbls.length === 0) return null;
    return parseFloat(this.bbls.firstObject.charAt(0));
  }),
  boroAbbr: computed('borough', function() {
    return boroughToAbbr(this.borough);
  }),

  // Analysis Framework
  totalUnits: DS.attr('number', { defaultValue: 0 }),
  seniorUnits: DS.attr('number', { defaultValue: 0 }),
  affordableUnits: DS.attr('number', { defaultValue: 0 }),

  commercialLandUse: DS.attr('', { defaultValue() { return []; } }),
  industrialLandUse: DS.attr('', { defaultValue() { return []; } }),
  communityFacilityLandUse: DS.attr('', { defaultValue() { return []; } }),
  parkingLandUse: DS.attr('', { defaultValue() { return []; } }),

  // Should probably move to PublicSchoolsAnalysis.
  // Any computed property that is specifically relevant to a given analyses should be its responsibility
  netUnits: computed('totalUnits', 'seniorUnits', function() {
    return this.get('totalUnits') - this.get('seniorUnits');
  }),

  // Analyses Relationships
  publicSchoolsAnalysis: DS.belongsTo('public-schools-analysis'),
  transportationAnalysis: DS.belongsTo('transportation-analysis'),
  communityFacilitiesAnalysis: DS.belongsTo('community-facilities-analysis'),
  airQualityAnalysis: DS.belongsTo('air-quality-analysis'),
});
