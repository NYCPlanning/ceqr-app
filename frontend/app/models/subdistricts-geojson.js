import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data';

export default class SubdistrictsGeojsonModel extends Model {
  @attr('') subdistrictsGeojson;
}
