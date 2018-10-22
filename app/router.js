import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      this.metrics.trackPage({ page, title });
    });
  }
});

Router.map(function() {
  this.route('login');

  this.route('password-reset', {path: '/password-reset/:id'});
  this.route('request-password-reset');

  this.route('signup', function() {
    this.route('email');
    this.route('in-review');
  });

  this.route('project', function() {
    this.route('new');
    this.route('show', {path: '/:id'}, function() {
      this.route('edit');

      // CEQR chapter routes
      this.route('schools-capacity', function() {
        this.route('analysis-threshold', {path: '/'});
        
        this.route('existing-conditions', function() {
          this.route('schools', {path: '/'});
          this.route('study-area');
          this.route('new-schools');
        });
        
        this.route('no-action', function() {
          this.route('scenario', {path: '/'});
          this.route('under-construction');
          this.route('utilization-changes');
          this.route('residential-development');
        });

        this.route('with-action', function() {
          this.route('scenario', {path: '/'});
          this.route('new-schools');
        });
      });

      // TODO: Soon.
      // this.route('transportation');

      this.route('summary', function() {
        this.route('schools-capacity');
      });
    });
  });

  this.route('user', function() {
    this.route('projects');
  });
});

export default Router;
