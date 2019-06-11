import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  geoid(i){
    return `000000000${i}`;
  },
  variable: faker.list.cycle('population', 'trans_total', 'trans_auto_total', 'trans_public_total'),
  value: faker.random.number,
  moe: faker.random.number,
});
