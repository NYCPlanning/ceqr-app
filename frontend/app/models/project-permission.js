import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProjectPermissionsModel extends Model {
  @belongsTo project;
  @belongsTo user;

  @attr('string') permission;

  @attr('number') userId;
  @attr('number') projectId;
}
