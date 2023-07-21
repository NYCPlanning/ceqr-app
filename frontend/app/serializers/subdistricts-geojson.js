import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class SubdistrictsGeojsonSerializer extends JSONAPISerializer {
  attrs = {
    subdistrictsGeojson: { serialize: true },
  };
}
