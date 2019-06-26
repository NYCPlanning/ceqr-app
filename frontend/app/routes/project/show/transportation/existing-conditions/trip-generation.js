import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsTripGenerationRoute extends Route {
  controllerName = 'project';

  renderTemplate() {
    this.render('project/show/transportation/existing-conditions/trip-generation/map', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'map',
      controller: this.controllerName
    })
    this.render('project/show/transportation/existing-conditions/trip-generation/table', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'table',
      controller: this.controllerName
    })
  }
}