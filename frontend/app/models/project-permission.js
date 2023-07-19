import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  project: belongsTo('project'),
  user: belongsTo('user'),
  permission: attr('string'),

  userId: attr('number'),
  projectId: attr('number'),
});
