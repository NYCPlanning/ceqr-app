import DS from 'ember-data';
const { Model, attr } = DS;

const { Model } = DS;

export default class BblModel extends Model {
  @attr('string') bbl;

  @attr('string') version;
}
