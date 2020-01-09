import MF from 'ember-data-model-fragments';
import { fragment } from 'ember-data-model-fragments/attributes';

// Fragments: modeSplitsFromUser
// --> auto/taxi/bus/subway/railroad/walk/ferry/streetcar/bicycle/motorcycle/other
// --> am/md/pm/saturday/allPeriods
export default MF.Fragment.extend({
  auto: fragment('mode-splits-time-periods'),
  taxi: fragment('mode-splits-time-periods'),
  bus: fragment('mode-splits-time-periods'),
  subway: fragment('mode-splits-time-periods'),
  railroad: fragment('mode-splits-time-periods'),
  walk: fragment('mode-splits-time-periods'),
  ferry: fragment('mode-splits-time-periods'),
  streetcar: fragment('mode-splits-time-periods'),
  bicycle: fragment('mode-splits-time-periods'),
  motorcycle: fragment('mode-splits-time-periods'),
  other: fragment('mode-splits-time-periods'),
});
