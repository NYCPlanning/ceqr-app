import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  publicSchoolsAnalysis: belongsTo('public-schools-analysis'),

  subdistrictsGeojson: attr(''),
});
