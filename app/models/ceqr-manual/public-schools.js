import DS from 'ember-data';

export default DS.Model.extend({
  thresholdPsIsStudents: DS.attr('number'),
  thresholdHsStudents: DS.attr('number'),

  findFor(project) {
    switch (this.id) {
      case 'march-2014':
        return this.get('boroughs').findBy('name', project.borough);
      case 'november-2018':
        return this.get('districts').findBy('csd', project.district);
    }
  },

  // March 2014 attributes
  boroughs: DS.attr(),

  // November 2018 attributes
  districts: DS.attr()
});
