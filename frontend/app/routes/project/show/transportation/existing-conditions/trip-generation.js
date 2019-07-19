import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsTripGenerationRoute extends Route {
  ctrlName = 'project/show/transportation/existing-conditions';

  renderTemplate() {
    this.render('project/show/transportation/existing-conditions/trip-generation/map', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'map',
      controller: this.ctrlName
    })
    this.render('project/show/transportation/existing-conditions/trip-generation/table', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'table',
      controller: this.ctrlName
    })
  }
}