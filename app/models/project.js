import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default DS.Model.extend({
  analysis: service(),
  
  address: DS.attr('string'),
  bbls: DS.attr(),
  yearBuilt: DS.attr('number'),
  borough: "Brooklyn",
  totalUnits: DS.attr('number'),
  seniorUnits: DS.attr('number'),
  
  netUnits: computed('totalUnits', 'seniorUnits', function() {
    return this.get('totalUnits') - this.get('seniorUnits');
  }),
  esEffect: computed('netUnits', 'borough', function() {
    return this.get('analysis').thresholdFor(this.get('borough')).es < this.get('netUnits');
  }),
  hsEffect: computed('netUnits', 'borough', function() {
    return this.get('analysis').thresholdFor(this.get('borough')).hs < this.get('netUnits');
  }),
  directEffect: DS.attr('boolean'),
  indirectEffect: computed('esEffect', 'hsEffect', function() {
    return (this.get('esEffect') || this.get('hsEffect'));
  }),
});
