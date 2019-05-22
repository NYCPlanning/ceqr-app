import DS from 'ember-data';
import School from '../../fragments/public-schools/School';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map(b => School.create(b));
  },

  serialize(deserialized) {
    return deserialized.map(b => ({...b}));
  }
});
