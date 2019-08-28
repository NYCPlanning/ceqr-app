import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default class ProjectSerializer extends JSONAPISerializer {
  attrs = {
    created_at:  { serialize: false },
    updated_at:  { serialize: false },
    updated_by:  { serialize: false },
    viewOnly:    { serialize: false },
    bblsGeojson: { serialize: false },
    bblsVersion: { serialize: false },
    borough:     { serialize: false },
    boroCode:    { serialize: false },

    publicSchoolsAnalysis: { serialize: false },
    transportationAnalysis: { serialize: false },
    communityFacilitiesAnalysis: { serialize: false }
  }
}
