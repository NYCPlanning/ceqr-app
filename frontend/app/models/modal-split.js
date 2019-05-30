import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data';

export default class DataTablesModalSplitsModel extends Model {
  @attr('string') residential_geoid;
  @attr('string') work_geoid;
  @attr('string') mode;
  @attr('number') count;
  @attr('number') standard_error;
}
