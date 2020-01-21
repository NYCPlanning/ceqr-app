import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ProjectSerializer extends JSONAPISerializer {
  attrs = {
    created_at: { serialize: false },
    updated_at: { serialize: false },
    updated_by: { serialize: false },
    viewOnly: { serialize: false },
    bblsGeojson: { serialize: false },
    bblsVersion: { serialize: false },

    publicSchoolsAnalysis: { serialize: false },
    transportationAnalysis: { serialize: false },
    communityFacilitiesAnalysis: { serialize: false },
  }
}
