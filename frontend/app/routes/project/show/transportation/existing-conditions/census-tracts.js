import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsCensusTractsRoute extends Route {
  ctrlName = 'project/show/transportation/existing-conditions';

  renderTemplate() {
    this.render('project/show/transportation/existing-conditions/census-tracts/map', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'map',
      controller: this.ctrlName
    })
    this.render('project/show/transportation/existing-conditions/census-tracts/table', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'table',
      controller: this.ctrlName
    })
  }
}