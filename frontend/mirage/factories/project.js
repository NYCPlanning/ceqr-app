import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  viewOnly: false,
  name() { return faker.address.streetName },
});
