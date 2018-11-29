import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),

  projectPermissions: DS.hasMany('project-permissions'),

  editable_and_viewable_projects: DS.hasMany('projects'),

  editable_projects: DS.hasMany('project', { inverse: 'editors' }),
  viewable_projects: DS.hasMany('project', { inverse: 'viewers' })
});
