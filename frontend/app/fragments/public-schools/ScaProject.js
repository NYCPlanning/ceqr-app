import EmberObject, { computed } from '@ember/object';


/**
 *
 * @constructor
 * @param {string} id - Aggregate unique identifier combining source, org_id, bldg_id, and level
 */
export default EmberObject.extend({
  id: computed('project_dsf', function () {
    return this.project_dsf;
  }),
});
