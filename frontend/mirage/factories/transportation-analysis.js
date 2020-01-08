import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  trafficZone: 2,
  requiredCensusTractsSelection: () => [
      "36061020300"
  ],
  censusTractsSelection: () => [
    '36061020500', '36061021100', '36061019701', '36061020701', '36061020101', '36061019900'
  ],
  censusTractsCentroid: () => [
    -73.964251, 40.8080809
  ],
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
      saturday: {
        in: 50,
        out: 50
      }
    }
  },
  taxiVehicleOccupancy: () => {
    return null;
  }
});
