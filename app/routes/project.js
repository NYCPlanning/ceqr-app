import Route from '@ember/routing/route';
// import normalizeCartoVectors from 'carto-promises-utility/utils/normalize-carto-vectors';
// import { hash } from 'rsvp';

export default class ProjectRoute extends Route {
  model = function(params) {
    return this.store.findRecord('project', params.project_id);
  }
}
