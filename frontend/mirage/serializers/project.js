import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['public-schools-analysis'], // eslint-disable-line
});
