import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default class TransportationPlanningFactorSerializer extends JSONAPISerializer {
  attrs = {
    censusTractVariables: { serialize: false },
    transportationAnalysis: { serialize: false },
  };
}
