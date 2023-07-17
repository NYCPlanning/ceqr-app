import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  onPublicSchools: computed('router.currentRouteName', function () {
    return this.get('router.currentRouteName').includes('public-schools');
  }),

  onSummary: computed('router.currentRouteName', function () {
    return this.get('router.currentRouteName').includes('summary');
  }),
});
