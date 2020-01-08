import DS from 'ember-data';
const { Model } = DS;
import { attr, hasMany } from '@ember-decorators/data';

export default class DataPackageModel extends Model {
  @attr('string') name;
  @attr('string') package;
  @attr('string') version;
  @attr('date') releaseDate;
  @attr('') schemas;

  @hasMany('transportationPlanningFactor') transportationPlanningFactors;
}
