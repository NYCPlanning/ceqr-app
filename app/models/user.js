import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),

  projects: DS.hasMany('project', { inverse: 'users' }),
  projects_viewable: DS.hasMany('project', { inverse: 'viewers' })
});
