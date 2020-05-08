import DS from 'ember-data';

const { JSONAPISerializer } = DS;

export default class SubdistrictsGeojsonSerializer extends JSONAPISerializer {
  attrs = {
    subdistrictsGeojson: { serialize: true },
  }
}
