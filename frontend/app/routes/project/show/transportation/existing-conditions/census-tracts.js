import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsCensusTractsRoute extends Route {
  controllerName = 'project';

  renderTemplate() {
    this.render('project/show/transportation/existing-conditions/census-tracts/map', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'map',
      controller: this.controllerName
    })
    this.render('project/show/transportation/existing-conditions/census-tracts/table', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'table',
      controller: this.controllerName
    })
  }
}