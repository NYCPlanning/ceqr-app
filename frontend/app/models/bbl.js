import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data';

export default class BblModel extends Model {
  @attr('string') bbl;
  @attr('string') version;
}
