import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default class DataPackageModel extends Model {
  @attr('string') name;
  @attr('string') package;
  @attr('string') version;
  @attr('date') releaseDate;
  @attr('') schemas;

  @hasMany('transportationPlanningFactor') transportationPlanningFactors;
}
