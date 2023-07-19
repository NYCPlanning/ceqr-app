import Model, { attr, hasMany } from '@ember-data/model';

export default class DataPackageModel extends Model {
  @attr('string') name;

  @attr('string') package;

  @attr('string') version;

  @attr('date') releaseDate;

  @attr('') schemas;

  @hasMany('transportationPlanningFactor') transportationPlanningFactors;
}
