import Transform from '@ember-data/serializer/transform';
import EmberObject from '@ember/object';

export default Transform.extend({
  deserialize(serialized) {
    return EmberObject.create(serialized);
  },

  serialize(deserialized) {
    return { ...deserialized };
  },
});
