import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PublicSchoolsAnalysisSerializer extends JSONAPISerializer {
  attrs = {
    newDataAvailable: { serialize: false },
    multipliers: { serialize: false },
  };
}
