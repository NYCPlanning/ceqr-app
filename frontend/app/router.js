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

  this.route('password-reset');
  this.route('request-password-reset');

  this.route('signup', function() {
    this.route('email');
    this.route('in-review');
  });

  this.route('project', function() {
    this.route('new');
    // we avoided using an underscore (:_id) specifically to
    // not trigger default model lookup for the project/show route.
    // See routes/project/show.js for custom .findRecord() call to include
    // related resources.
    this.route('show', {path: '/:id'}, function() {
      this.route('edit');

      // CEQR chapter routes
      this.route('public-schools', function() {
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

        this.route('summary');
      });

      this.route('transportation', function() {
        this.route('analysis-threshold', {path: '/'});
        this.route('tdf', function() {
          this.route('planning-factors', function() {
            this.route('show', { path: '/:transportation_planning_factor_id' });
          });
          this.route('trip-results');
        });
      });

      this.route('community-facilities', function() {
        this.route('analysis-threshold', {path: '/'});
      });
    });
  });

  this.route('user', function() {
    this.route('projects');
  });

  this.route('four-oh-four', { path: "*path" });
});

export default Router;
