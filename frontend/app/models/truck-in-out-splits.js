import MF from 'ember-data-model-fragments';
import { fragment } from 'ember-data-model-fragments/attributes';

// Fragments: truckInOutSplits --> allDay --> in/out
export default MF.Fragment.extend({
  allDay : fragment('in-out'),
});
