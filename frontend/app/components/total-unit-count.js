import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  netUnits: computed('model.{totalUnits,seniorUnits}', function() {
    return this.get('model.totalUnits') - this.get('model.seniorUnits');
  })
});
