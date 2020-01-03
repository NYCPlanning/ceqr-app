import Route from '@ember/routing/route';
import window from 'ember-window-mock';

export default class ScrollableRouteRoute extends Route {
  activate = function() {
    this._super();
    window.scrollTo(0,0);
  }
}
