import attr from 'ember-data/attr';
import MF from 'ember-data-model-fragments';

// Fragments: inOutSplits --> am/md/pm/saturday --> in/out
// Fragments: truckInOutSplits --> allDay --> in/out
export default MF.Fragment.extend({
  in: attr('number', { defaultValue: 50 }),
  out: attr('number', { defaultValue: 50 }),
});
