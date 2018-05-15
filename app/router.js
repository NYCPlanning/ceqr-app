import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('project', {path: '/project/:project_id'}, function() {
    this.route('existing-conditions');
    this.route('no-action');
  });
});

export default Router;
