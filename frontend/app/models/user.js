import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  email: attr('string'),

  projectPermissions: hasMany('project-permissions'),

  editable_and_viewable_projects: hasMany('projects'),

  editable_projects: hasMany('project', { inverse: 'editors' }),
  viewable_projects: hasMany('project', { inverse: 'viewers' }),
});
