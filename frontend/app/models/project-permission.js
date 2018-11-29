import DS from 'ember-data';

export default DS.Model.extend({
  project: DS.belongsTo('project'),
  user: DS.belongsTo('user'),
  permission: DS.attr('string'),

  userId: DS.attr('number'),
  projectId: DS.attr('number'),
});
