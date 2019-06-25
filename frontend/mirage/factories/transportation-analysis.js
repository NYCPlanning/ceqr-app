import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
  trafficZone: 2,
  jtwStudySelection: () => [
      "36061020300"
  ],
  project: association({
    totalUnits: 1000,
  }),
});
