import Transform from '@ember-data/serializer/transform';
import School from '../../fragments/public-schools/School';

export default class PublicSchoolsSchoolsTransform extends Transform {
  deserialize(serialized) {
    return serialized.map((b) => School.create(b));
  }

  serialize(deserialized) {
    return deserialized.map((b) => ({ ...b }));
  }
}
