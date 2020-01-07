import attr from 'ember-data/attr';
import MF from 'ember-data-model-fragments';

// Fragments: modeSplitsFromUser
// --> auto/taxi/bus/subway/railroad/walk/ferry/streetcar/bicycle/motorcycle/other
// --> am/md/pm/saturday/allPeriods
export default MF.Fragment.extend({
  am: attr('number', { defaultValue: 0 }),
  md: attr('number', { defaultValue: 0 }),
  pm: attr('number', { defaultValue: 0 }),
  saturday: attr('number', { defaultValue: 0 }),
  allPeriods: attr('number', { defaultValue: 0 }),
});
