import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from 'labs-ceqr/config/environment';

const Router = EmberRouter.extend({
  init(...args) {
    this._super(...args);
    this.on('routeDidChange', () => {
      this._trackPage();
    });
  },

  location: config.locationType,
  rootURL: config.rootURL,
  metrics: service(),

  _trackPage() {
    function trackPage() {
      const page = this.url;
      const title =
        this.currentRouteName === undefined ? 'unknown' : this.currentRouteName;

      this.metrics.trackPage({ page, title });
    }
    scheduleOnce('afterRender', this, trackPage);
  },
});

Router.map(function () {
  this.route('login');

  this.route('password-reset');
  this.route('request-password-reset');

  this.route('signup', function () {
    this.route('email');
    this.route('in-review');
    this.route('approve');
  });

  this.route('project', function () {
    this.route('new');
    // we avoided using an underscore (:_id) specifically to
    // not trigger default model lookup for the project/show route.
    // See routes/project/show.js for custom .findRecord() call to include
    // related resources.
    this.route('show', { path: '/:id' }, function () {
      this.route('edit');

      // CEQR chapter routes
      this.route('public-schools', function () {
        this.route('analysis-threshold', { path: '/' });

        this.route('existing-conditions', function () {
          this.route('schools', { path: '/' });
          this.route('study-area');
          this.route('new-schools');
        });

        this.route('no-action', function () {
          this.route('scenario', { path: '/' });
          this.route('under-construction');
          this.route('utilization-changes');
          this.route('residential-development');
        });

        this.route('with-action', function () {
          this.route('scenario', { path: '/' });
          this.route('new-schools');
        });

        this.route('summary');
      });

      this.route('transportation', function () {
        this.route('analysis-threshold', { path: '/' });
        this.route('tdf', function () {
          this.route('planning-factors', function () {
            this.route('show', { path: '/:transportation_planning_factor_id' });
          });
          this.route('trip-results', function () {
            this.route('show', { path: '/:transportation_planning_factor_id' });
            this.route('total');
          });
        });
      });

      this.route('community-facilities', function () {
        this.route('analysis-threshold', { path: '/' });
      });
    });
  });

  this.route('user', function () {
    this.route('projects');
  });

  this.route('four-oh-four', { path: '*path' });
  this.route('ceqr-intro-page');

  this.route('data', function () {
    this.route('air-quality');
    this.route('transportation-trip-generation');
  });
});

export default Router;
