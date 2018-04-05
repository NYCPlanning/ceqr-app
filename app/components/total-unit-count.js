import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  totalUnits: 0,
  seniorUnits: 0,
  
  netUnits: computed('totalUnits', 'seniorUnits', function() {
    let totalUnits = this.get('totalUnits');
    let seniorUnits = this.get('seniorUnits');

    return totalUnits - seniorUnits;
  })
});
