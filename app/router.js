import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('project', function() {
    this.route('new');
    this.route('show', {path: '/:project_id'}, function() {
      this.route('edit');
      this.route('analysis-threshold', {path: '/'});
      this.route('existing-conditions');
      this.route('no-action');
    });
  });
});

export default Router;
