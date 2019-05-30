import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  residential_geoid: '1234a',
  work_geoid: '4321b',
  mode: 'car',
  count: 1000,
  standard_error: 10.5,
});
