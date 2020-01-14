import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ProjectShowTransportationTdfIndexRoute extends Route {
  @service router;

  // redirect(model) {
  // console.log(this.routeName);
  // console.log(this.router.currentRouteName);
  // window.router = this.router;

  // if (this.router.currentRouteName === this.routeName) {
  //   this.replaceWith('project.show.transportation.tdf.planning-factors', model.project);
  // }

  // let project = await model.project;
  // this.transitionTo('project.show.transportation.tdf.planning-factors', model.project);
  // }
}
