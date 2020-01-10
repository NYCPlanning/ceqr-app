import DS from 'ember-data';
import EmberObject from '@ember/object';

export default DS.Transform.extend({
  deserialize(serialized) {
    return EmberObject.create(serialized);
  },

  serialize(deserialized) {
    return { ...deserialized };
  },
});
