import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  trafficZone: 2,
  jtwStudySelection: () => [],
  requiredJtwStudySelection: () => [
    "36061020300"
  ]
});
