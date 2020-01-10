import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default class PublicSchoolsAnalysisSerializer extends JSONAPISerializer {
  attrs = {
    censusTractsCentroid: { serialize: false },
    requiredCensusTractsSelection: { serialize: false },
    trafficZone: { serialize: false },
  }
}
