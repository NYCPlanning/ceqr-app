import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  // this.route('signup');

  this.authenticatedRoute('project', function() {
    this.route('new');
    this.route('show', {path: '/:ceqr_number'}, function() {
      this.route('edit');

      // CEQR chapter routes
      this.route('schools-capacity', function() {
        this.route('analysis-threshold', {path: '/'});
        this.route('existing-conditions');
        this.route('no-action');
        this.route('with-action');
      });

      this.route('transportation');

      this.route('summary', function() {
        this.route('schools-capacity');
      });
    });
  });

  this.authenticatedRoute('user', function() {
    this.route('projects');
  });
});

export default Router;
