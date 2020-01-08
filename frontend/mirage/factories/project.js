import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  viewOnly: false,
  name: faker.address.streetName,
  buildYear: 2018,
  bbls: () => ['1019730001'],
  bblsGeojson: () => {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [-73.95944768975842, 40.80929214876363],
              [-73.96112392735277, 40.80699583564126],
              [-73.9635969491312, 40.808032096187006],
              [-73.96192107071839, 40.81033240266901],
              [-73.95944768975842, 40.80929214876363]
            ]
          }
        }
      ]
    };
  },
  totalUnits: 1000,
  seniorUnits: 0,
  affordableUnits: 0,
  commercialLandUse: () => [],
  industrialLandUse: () => [],
  communityFacilityLandUse: () => [],
  parkingLandUse: () => [],
});
