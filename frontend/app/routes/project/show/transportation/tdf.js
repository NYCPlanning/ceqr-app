import Route from '@ember/routing/route';

export default class ProjectShowTransportationTdfRoute extends Route {
  beforeModel() {
    this.replaceWith('project.show.transportation.tdf.planning-factors');
  }
}
