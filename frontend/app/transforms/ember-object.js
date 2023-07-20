import Transform from '@ember-data/serializer/transform';
import EmberObject from '@ember/object';

export default class EmberObjectTransform extends Transform {
  deserialize(serialized) {
    return EmberObject.create(serialized);
  }

  serialize(deserialized) {
    return { ...deserialized };
  }
}
