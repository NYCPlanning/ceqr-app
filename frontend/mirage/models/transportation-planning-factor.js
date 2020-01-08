import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  transportationAnalysis: belongsTo(),
  dataPackage: belongsTo(),
});
