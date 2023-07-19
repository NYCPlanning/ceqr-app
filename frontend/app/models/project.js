import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import boroughToAbbr from 'labs-ceqr/utils/boroughToAbbr';

export default Model.extend({
  currentUser: service(),

  editors: hasMany('user', { inverse: 'editable_projects' }),
  viewers: hasMany('user', { inverse: 'viewable_projects' }),
  projectPermissions: hasMany('project-permissions'),

  dataPackage: belongsTo('dataPackage'),

  viewOnly: attr('boolean'),

  created_at: attr('string'),
  updated_at: attr('string'),
  updated_by: attr('string'),

  name: attr('string'),
  buildYear: attr('number'),
  ceqrNumber: attr('string'),

  bbls: attr('', {
    defaultValue() {
      return [];
    },
  }),
  bblsVersion: attr('string'),
  bblsGeojson: attr(''),

  borough: computed('boroCode', function () {
    switch (this.boroCode) {
      case 1:
        return 'Manhattan';
      case 2:
        return 'Bronx';
      case 3:
        return 'Brooklyn';
      case 4:
        return 'Queens';
      case 5:
        return 'Staten Island';
      default:
        return null;
    }
  }),
  boroCode: computed('bbls.[]', function () {
    if (this.bbls.length === 0) return null;
    return parseFloat(this.bbls.firstObject.charAt(0));
  }),
  boroAbbr: computed('borough', function () {
    return boroughToAbbr(this.borough);
  }),

  // Analysis Framework
  totalUnits: attr('number', { defaultValue: 0 }),
  seniorUnits: attr('number', { defaultValue: 0 }),
  affordableUnits: attr('number', { defaultValue: 0 }),

  commercialLandUse: attr('', {
    defaultValue() {
      return [];
    },
  }),
  industrialLandUse: attr('', {
    defaultValue() {
      return [];
    },
  }),
  communityFacilityLandUse: attr('', {
    defaultValue() {
      return [];
    },
  }),
  parkingLandUse: attr('', {
    defaultValue() {
      return [];
    },
  }),

  // Should probably move to PublicSchoolsAnalysis.
  // Any computed property that is specifically relevant to a given analyses should be its responsibility
  netUnits: computed('totalUnits', 'seniorUnits', function () {
    return this.totalUnits - this.seniorUnits;
  }),

  // Analyses Relationships
  publicSchoolsAnalysis: belongsTo('public-schools-analysis'),
  transportationAnalysis: belongsTo('transportation-analysis'),
  communityFacilitiesAnalysis: belongsTo('community-facilities-analysis'),
});
