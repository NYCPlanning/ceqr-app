import DS from 'ember-data';
const { JSONAPISerializer } = DS;

export default class PublicSchoolsAnalysisSerializer extends JSONAPISerializer {
  attrs = {
    newDataAvailable:  { serialize: false },
    multipliers:  { serialize: false },
    subdistrictsGeojson: { serialize: false }
  }
}
