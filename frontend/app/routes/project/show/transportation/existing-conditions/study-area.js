import Route from '@ember/routing/route';

export default class ProjectShowTransportationExistingConditionsStudyAreaRoute extends Route {
  controllerName = 'project';

  renderTemplate() {
    this.render('project/show/transportation/existing-conditions/study-area/map', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'map',
      controller: this.controllerName
    })
    this.render('project/show/transportation/existing-conditions/study-area/table', {
      into: 'project/show/transportation/existing-conditions',
      outlet: 'table',
      controller: this.controllerName
    })
  }
}