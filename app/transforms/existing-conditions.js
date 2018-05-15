import DS from 'ember-data';
import ExistingConditions from '../analysis/existingConditions';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map(
      (s) => ({
        ...s,
        ps: ExistingConditions.create(s.ps),
        is: ExistingConditions.create(s.is)
      })
    )
  },

  serialize(deserialized) {
    return deserialized;
  }
});
