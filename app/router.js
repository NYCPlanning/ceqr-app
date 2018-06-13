import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('signup');
  
  this.authenticatedRoute('project', function() {
    this.route('new');
    this.route('show', {path: '/:project_id'}, function() {
      this.route('edit');
      this.route('analysis-threshold', {path: '/'});
      this.route('existing-conditions');
      this.route('no-action');
      this.route('with-action');
      this.route('results');
    });
  });

  this.authenticatedRoute('user', function() {
    this.route('projects');
  });
});

export default Router;
