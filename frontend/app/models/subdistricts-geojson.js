import DS from 'ember-data';

export default DS.Model.extend({
  publicSchoolsAnalysis: DS.belongsTo('public-schools-analysis'),

  subdistrictsGeojson: DS.attr(''),
});
