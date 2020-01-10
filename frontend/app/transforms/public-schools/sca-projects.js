import DS from 'ember-data';
import ScaProject from '../../fragments/public-schools/ScaProject';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map((b) => ScaProject.create(b));
  },

  serialize(deserialized) {
    return deserialized.map((b) => ({ ...b }));
  },
});
