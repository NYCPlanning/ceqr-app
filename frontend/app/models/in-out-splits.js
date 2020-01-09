import MF from 'ember-data-model-fragments';
import { fragment } from 'ember-data-model-fragments/attributes';

// Fragments: inOutSplits --> am/md/pm/saturday --> in/out
export default MF.Fragment.extend({
  am: fragment('in-out'),
  md: fragment('in-out'),
  pm: fragment('in-out'),
  saturday: fragment('in-out'),
});
