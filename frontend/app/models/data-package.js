import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data';

export default class DataPackageModel extends Model {
  @attr('string') name;
  @attr('string') package;
  @attr('string') version;
  @attr('date') releaseDate;
  @attr('') schemas;
}
