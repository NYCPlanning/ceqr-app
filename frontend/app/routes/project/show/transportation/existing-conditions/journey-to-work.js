import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsJourneyToWorkRoute extends Route {
  ctrlName = 'project/show/transportation/existing-conditions';

  renderTemplate() {
    this.render('project/show/transportation/existing-conditions/journey-to-work/map', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'map',
      controller: this.ctrlName
    })
    this.render('project/show/transportation/existing-conditions/journey-to-work/table', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'table',
      controller: this.ctrlName
    })
  }
}