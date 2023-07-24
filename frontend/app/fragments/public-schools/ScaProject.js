import EmberObject, { computed } from '@ember/object';

/**
 *
 * @constructor
 * @param {string} id - Aggregate unique identifier combining source, org_id, bldg_id, and level
 */
export default class ScaProjectFragment extends EmberObject {
  @computed.reads('uid') id;
}
