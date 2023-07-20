import Transform from '@ember-data/serializer/transform';
import FutureResidentialDevelopment from '../../fragments/public-schools/FutureResidentialDevelopment';

export default class PublicSchoolsResidentialDevelopmentsTransform extends Transform {
  deserialize(serialized) {
    return serialized.map((b) => {
      // Defense from saved totals
      delete b.ps_students;
      delete b.is_students;
      delete b.hs_students;

      return FutureResidentialDevelopment.create(b);
    });
  }

  serialize(deserialized) {
    return deserialized.map((b) => ({ ...b }));
  }
}
