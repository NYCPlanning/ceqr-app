import attr from 'ember-data/attr';
import MF from 'ember-data-model-fragments';

// Fragments: vehicleOccupancyFromUser --> auto/taxi --> am/md/pm/saturday/allPeriods
export default MF.Fragment.extend({
  am: attr('number', { defaultValue: 1 }),
  md: attr('number', { defaultValue: 1 }),
  pm: attr('number', { defaultValue: 1 }),
  saturday: attr('number', { defaultValue: 1 }),
  allPeriods: attr('number', { defaultValue: 1 }),
});
