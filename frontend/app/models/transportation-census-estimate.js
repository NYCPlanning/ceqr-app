import DS from 'ember-data';
const { Model } = DS;
import { attr } from '@ember-decorators/data';
import { computed } from '@ember-decorators/object';

/**
 * A censusTract record represents a single transportation census data variable for a given geoid.
 * Four individual census tract objects represent the full data for a single geoid:
 * - population
 * - trans_total
 * - trans_auto_total
 * - trans_public_total
 * where trans_* variables are modal split data.
 */
export default class TransportationCensusEstimateModel extends Model {
  @attr('string') geoid;
  @attr('string') variable;
  @attr('number') value;
  @attr('number') moe;

  /**
   * Returns the human-readable "mode" string for a given census-tract variable
   */
  @computed('variable')
  get mode() {
    const variable = this.get('variable');
    return VARIABLE_MODE_LOOKUP[variable] || 'Unknown';
  }
}

export const VARIABLE_MODE_LOOKUP = {
  trans_total: 'All',
  trans_auto_total: 'Automobile',
  trans_public_total: 'Public Transportation',
};
