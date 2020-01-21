import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class TransportationPlanningFactorSerializer extends JSONAPISerializer {
  attrs = {
    censusTractVariables: { serialize: false },
    transportationAnalysis: { serialize: false },
  }
}
