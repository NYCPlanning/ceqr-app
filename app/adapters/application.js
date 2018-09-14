import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: window.EmberENV.apiURL
});