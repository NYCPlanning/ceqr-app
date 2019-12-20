import { Model, hasMany} from 'ember-cli-mirage';

export default Model.extend({
  project: hasMany(),
  transportationPlanningFactors: hasMany(),
});