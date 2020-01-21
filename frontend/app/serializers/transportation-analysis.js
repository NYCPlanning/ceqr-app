import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PublicSchoolsAnalysisSerializer extends JSONAPISerializer {
  attrs = {
    censusTractsCentroid: { serialize: false },
    requiredCensusTractsSelection: { serialize: false },
    trafficZone: { serialize: false },
  }
}
