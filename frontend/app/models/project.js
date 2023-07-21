import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import boroughToAbbr from 'labs-ceqr/utils/boroughToAbbr';

export default class ProjectModel extends Model {
  @service currentUser;

  @hasMany('user', { inverse: 'editable_projects' }) editors;
  @hasMany('user', { inverse: 'viewable_projects' }) viewers;
  @hasMany('project-permissions') projectPermissions;

  @belongsTo('dataPackage') dataPackage;

  @attr('boolean') viewOnly;

  @attr('string') created_at;
  @attr('string') updated_at;
  @attr('string') updated_by;

  @attr('string') name;
  @attr('number') buildYear;
  @attr('string') ceqrNumber;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  bbls;
  @attr('string') bblsVersion;
  @attr('') bblsGeojson;

  @computed('boroCode', function () {
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
  })
  borough;

  @computed('bbls.[]', function () {
    if (this.bbls.length === 0) return null;
    return parseFloat(this.bbls.firstObject.charAt(0));
  })
  boroCode;

  @computed('borough', function () {
    return boroughToAbbr(this.borough);
  })
  boroAbbr;

  // Analysis Framework
  @attr('number', { defaultValue: 0 }) totalUnits;
  @attr('number', { defaultValue: 0 }) seniorUnits;
  @attr('number', { defaultValue: 0 }) affordableUnits;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  commercialLandUse;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  industrialLandUse;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  communityFacilityLandUse;

  @attr('', {
    defaultValue() {
      return [];
    },
  })
  parkingLandUse;

  // Should probably move to PublicSchoolsAnalysis.
  // Any computed property that is specifically relevant to a given analyses should be its responsibility
  @computed('totalUnits', 'seniorUnits', function () {
    return this.totalUnits - this.seniorUnits;
  })
  netUnits;

  // Analyses Relationships
  @belongsTo('public-schools-analysis') publicSchoolsAnalysis;
  @belongsTo('transportation-analysis') transportationAnalysis;
  @belongsTo('community-facilities-analysis') communityFacilitiesAnalysis;
}
