import DS from 'ember-data';
const { Transform } = DS;
import FutureResidentialDevelopment from '../../decorators/public-schools/FutureResidentialDevelopment';

export default class PublicSchoolsResidentialDevelopmentTransform extends Transform {
  deserialize(serialized) {        
    return serialized.map((b) => {
      // Defense from saved totals
      delete b['ps_students'];
      delete b['is_students'];
      delete b['hs_students'];

      return FutureResidentialDevelopment.create(b)
    });
  }

  serialize(deserialized) {
    return deserialized.map(b => ({...b}));
  }
}
