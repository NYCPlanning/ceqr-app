import Model, { attr, hasMany } from '@ember-data/model';

export default class User extends Model {
  @attr('string') email;

  @hasMany('project-permissions') projectPermissions;

  @hasMany('projects') editable_and_viewable_projects;

  @hasMany('project', { inverse: 'editors' }) editable_projects;
  @hasMany('project', { inverse: 'viewers' }) viewable_projects;
}
