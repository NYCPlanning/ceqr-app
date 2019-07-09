import { Factory, association } from 'ember-cli-mirage';

export default Factory.extend({
  trafficZone: 2,
  requiredJtwStudySelection: () => [
      "36061020300"
  ],
  jtwStudySelection: () => [
    '36061020500', '36061021100', '36061019701', '36061020701', '36061020101', '36061019900'
  ],
  jtwStudyAreaCentroid: () => [
    -73.964251, 40.8080809
  ],
  project: association({
    totalUnits: 1000,
  }),
  inOutDists: () => {
    return {
      am: {
        in: 50,
        out: 50
      },
      md: {
        in: 50,
        out: 50
      },
      pm: {
        in: 50,
        out: 50
      },
      saturday : {
        in: 50,
        out: 50
      }
    }
  }
});
