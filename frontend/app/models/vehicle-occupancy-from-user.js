import MF from 'ember-data-model-fragments';
import { fragment } from 'ember-data-model-fragments/attributes';

// Fragments: vehicleOccupancyFromUser --> auto/taxi --> am/md/pm/saturday/allPeriods
export default MF.Fragment.extend({
  auto: fragment('vehicle-occupancy-time-periods'),
  taxi: fragment('vehicle-occupancy-time-periods'),
});
