import DS from 'ember-data';
import Building from '../analysis/building';

export default DS.Transform.extend({
  deserialize(serialized) {
    return {
      ps: serialized.ps ? serialized.ps.map(b => Building.create(b)) : [],
      is: serialized.is ? serialized.is.map(b => Building.create(b)) : [],
      hs: serialized.hs ? serialized.hs.map(b => Building.create(b)) : [],
    }
  },

  serialize(deserialized) {
    return {
      ps: deserialized.ps.map(b => ({...b})),
      is: deserialized.is.map(b => ({...b})),
      hs: deserialized.hs.map(b => ({...b})),
    }
  }
});
