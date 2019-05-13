import DS from 'ember-data';
import Building from '../fragments/public-schools/Building';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map(b => Building.create(b));
  },

  serialize(deserialized) {
    return deserialized.map(b => ({...b}));
  }
});
