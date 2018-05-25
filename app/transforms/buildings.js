import DS from 'ember-data';
import Building from '../decorators/Building';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map(b => Building.create(b));
  },

  serialize(deserialized) {
    return deserialized.map(b => ({...b}));
  }
});
