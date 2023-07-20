import Transform from '@ember-data/serializer/transform';
import ScaProject from '../../fragments/public-schools/ScaProject';

export default class PublicSchoolsScaProjectTransform extends Transform {
  deserialize(serialized) {
    return serialized.map((b) => ScaProject.create(b));
  }

  serialize(deserialized) {
    return deserialized.map((b) => ({ ...b }));
  }
}
