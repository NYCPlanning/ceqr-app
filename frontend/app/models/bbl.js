import Model, { attr } from '@ember-data/model';

export default class BblModel extends Model {
  @attr('string') bbl;

  @attr('string') version;
}
