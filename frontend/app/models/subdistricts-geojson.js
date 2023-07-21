import Model, { attr, belongsTo } from '@ember-data/model';

export default class SubdistrictsGeojsonModel extends Model {
  @belongsTo('public-schools-analysis') publicSchoolsAnalysis;

  @attr('') subdistrictsGeojson;
}
