import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  afterCreate(project, server) {
    server.create('public-schools-analysis', { project });
    server.create('transportation-analysis', { project });
    server.create('community-facilities-analysis', { project });
  },

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
  borough: 'Manhattan',
  totalUnits: 1000,
  seniorUnits: 0,
  affordableUnits: 0,
  commercialLandUse: () => [],
  industrialLandUse: () => [],
  communityFacilityLandUse: () => [],
  parkingLandUse: () => [],
});

// Example Production "Project":
// {
//   "viewOnly": false,
//   "created_at": "2019-04-09T18:22:01.101Z",
//   "updated_at": "2019-04-09T18:27:09.600Z",
//   "updated_by": "wgardner@planning.nyc.gov",
//   "name": "Prospect Park Acres",
//   "buildYear": 2020,
//   "ceqrNumber": "",
//   "bbls": [
//     "3011170001"
//   ],
//   "bblsVersion": "mappluto_18v2",
//   "bblsGeojson": {
//     "type": "FeatureCollection",
//     "features": [
//       {
//         "type": "Feature",
//         "geometry": {
//           "type": "MultiPolygon",
//           "coordinates": [ [coordinates], [coordinates], [coordinates] ]
//         },
//         "properties": {}
//       }
//     ]
//   },
//   "borough": "Brooklyn",
//   "totalUnits": 10000,
//   "seniorUnits": 0,
//   "affordableUnits": 0,
//   "commercialLandUse": [
//     {
//       "name": "Fast Food Restaurant",
//       "type": "fast-food",
//       "grossSqFt": 5000
//     }
//   ],
//   "industrialLandUse": [],
//   "communityFacilityLandUse": [],
//   "parkingLandUse": [],
//   "publicSchoolsAnalysis": "335",
//   "transportationAnalysis": "243",
//   "communityFacilitiesAnalysis": "243",
// }
